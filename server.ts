import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set max body size for base64 refrigerator photos
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Shared Gemini client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to analyze refrigerator photo and generate cooking guide module
app.post('/api/detect-and-generate-recipe', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', preferences } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Foto kulkas belum disertakan. Silakan unggah foto kulkas.' });
    }

    // Clean base64 if it has data URL prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const promptText = `
Anda adalah sistem kecerdasan buatan dari aplikasi bernama "Aplikasi Resep Kulkas".
Tugas utama Anda adalah:
1. Mendeteksi secara teliti semua bahan makanan (sayuran, protein, susu/olahan, buah, bumbu/saus, dll.) yang terlihat dari foto isi kulkas yang diunggah pengguna.
2. Membuat materi panduan memasak edukatif yang terstruktur dalam bentuk modul dokumen kuliner siap cetak (PDF).

Format modul materi kuliner wajib memiliki 4 komponen berikut dalam Bahasa Indonesia yang santun, informatif, dan edukatif:
1. Cover Halaman:
   - Judul yang menarik dan menggugah selera (contoh: "Kreasi Lezat Dapur Kulkas: Menu Sehat Dari Bahan Tersedia")
   - Sub-judul yang jelas dan edukatif
   - Gambaran/deskripsi ilustrasi cover yang representatif (deskripsi visual artistik tentang suasana memasak hangat dengan bahan-bahan kulkas yang ditemukan)
   - Badge edisi modul (contoh: "Modul Edukasi Memasak #01")
   - Tanggal terbit / pembuatan modul

2. Daftar Bahan Terdeteksi:
   - Identifikasi semua bahan makanan yang terlihat di kulkas.
   - Kategorikan: Sayuran & Jamur, Protein & Telur/Daging/Ikan, Susu & Olahan, Buah-buahan, Bumbu & Kondimen, atau Lainnya.
   - Berikan perkiraan jumlah/kondisi (misal: "Segar", "Perlu segera diolah", "Setengah botol", dsb.).
   - Berikan catatan/tips penyimpanan spesifik untuk setiap bahan.

3. Materi Panduan Memaksimalkan Bahan:
   - Tema edukasi yang berkaitan dengan bahan-bahan yang ditemukan.
   - Ringkasan edukatif singkat.
   - 3-4 Tips penyimpanan cerdas agar bahan awet dan tidak cepat busuk (food storage & zero food waste tips).
   - 2-3 Fakta nutrisi bermanfaat dari bahan utama yang terdeteksi.
   - Tips pencegahan pemborosan makanan (anti food waste).

4. Resep Masakan Kreatif:
   - Buat 1 atau 2 resep masakan yang memanfaatkan bahan-bahan terdeteksi secara maksimal dan realistis.
   - Setiap resep wajib memuat:
     • Nama Menu yang menarik
     • Tagline/Deskripsi singkat menu
     • Waktu Memasak (misal: "25 Menit")
     • Tingkat Kesulitan ("Mudah" | "Sedang" | "Mahir")
     • Porsi (misal: "2-3 Porsi")
     • Daftar Bahan Utama (yang diambil dari kulkas) lengkap dengan takaran
     • Daftar Bahan Dapur Pendukung (garam, minyak, lada, air, bawang biasa) dengan takaran
     • Langkah-langkah Pembuatan yang Rapi dan Terurut (dengan tips teknik memasak di setiap langkah penting)
     • Catatan Koki (Chef Note) & Tips Penyajian

Catatan preferensi pengguna jika ada: ${preferences ? preferences : 'Standar masakan lezat rumahan nusantara & modern seimbang'}.

Kembalikan respon strictly dalam format JSON sesuai schema yang ditentukan. Pastikan data lengkap, mendalam, dan berkualitas tinggi untuk kebutuhan edukasi cetak.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cover: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                coverIllustrationDescription: { type: Type.STRING },
                editionBadge: { type: Type.STRING },
                dateGenerated: { type: Type.STRING },
              },
              required: ['title', 'subtitle', 'coverIllustrationDescription', 'editionBadge', 'dateGenerated'],
            },
            detectedIngredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  estimatedQuantityOrCondition: { type: Type.STRING },
                  storageAdvice: { type: Type.STRING },
                },
                required: ['name', 'category', 'estimatedQuantityOrCondition', 'storageAdvice'],
              },
            },
            educationGuide: {
              type: Type.OBJECT,
              properties: {
                themeTitle: { type: Type.STRING },
                introSummary: { type: Type.STRING },
                storageTips: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                    required: ['title', 'description'],
                  },
                },
                nutritionFacts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      ingredient: { type: Type.STRING },
                      highlightNutrient: { type: Type.STRING },
                      healthBenefit: { type: Type.STRING },
                    },
                    required: ['ingredient', 'highlightNutrient', 'healthBenefit'],
                  },
                },
                antiFoodWasteTip: { type: Type.STRING },
              },
              required: ['themeTitle', 'introSummary', 'storageTips', 'nutritionFacts', 'antiFoodWasteTip'],
            },
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  menuName: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  cookingTime: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  servings: { type: Type.STRING },
                  mainIngredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  pantryIngredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.INTEGER },
                        instruction: { type: Type.STRING },
                        proTip: { type: Type.STRING },
                      },
                      required: ['stepNumber', 'instruction'],
                    },
                  },
                  chefNote: { type: Type.STRING },
                },
                required: [
                  'menuName',
                  'tagline',
                  'cookingTime',
                  'difficulty',
                  'servings',
                  'mainIngredients',
                  'pantryIngredients',
                  'steps',
                  'chefNote',
                ],
              },
            },
          },
          required: ['cover', 'detectedIngredients', 'educationGuide', 'recipes'],
        },
      },
    });

    const textOutput = response.text || '{}';
    const parsedData = JSON.parse(textOutput);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating recipe module:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Gagal memproses foto kulkas dan menghasilkan materi kuliner.',
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Resep Kulkas server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
