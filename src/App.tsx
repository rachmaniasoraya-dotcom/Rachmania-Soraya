import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  FileDown,
  Printer,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { RecipeGuideModule } from './types/recipe';
import { SAMPLE_FRIDGE_PHOTOS, SamplePhoto } from './data/samplePhotos';
import { DocumentPages } from './components/DocumentPages';
import { downloadModulePdf } from './utils/pdfGenerator';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [preferences, setPreferences] = useState<string>('');
  const [showPreferences, setShowPreferences] = useState<boolean>(false);

  // Camera capture states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Loading & Generation states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [moduleData, setModuleData] = useState<RecipeGuideModule | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // References to rendered printable page DOM elements
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setErrorMessage(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setIsCameraActive(false);
      setErrorMessage('Tidak dapat mengakses kamera. Pastikan izin kamera aktif atau unggah foto dari file.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setSelectedImage(dataUrl);
        setMimeType('image/jpeg');
      }
      stopCamera();
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap unggah file foto gambar (JPEG, PNG, WEBP).');
      return;
    }
    setErrorMessage(null);
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SamplePhoto) => {
    setSelectedImage(sample.dataUrl);
    setMimeType('image/svg+xml');
    setErrorMessage(null);
  };

  const handleGenerateModule = async () => {
    if (!selectedImage) {
      setErrorMessage('Silakan pilih atau unggah foto kulkas terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setModuleData(null);
    setDownloadSuccess(false);

    // Simulated step indicators for delightful UX
    setProcessingStep(1);
    const step2Timer = setTimeout(() => setProcessingStep(2), 1200);
    const step3Timer = setTimeout(() => setProcessingStep(3), 2600);

    try {
      const response = await fetch('/api/detect-and-generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: mimeType,
          preferences: preferences.trim() || undefined,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Gagal memproses foto kulkas.');
      }

      setProcessingStep(4);
      setModuleData(resData.data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 'Terjadi kesalahan saat memproses foto kulkas. Pastikan foto cukup jelas dan coba lagi.'
      );
    } finally {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setIsProcessing(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!moduleData) return;
    try {
      setIsGeneratingPdf(true);
      setErrorMessage(null);
      const validElements = pageRefs.current.filter((el): el is HTMLDivElement => el !== null);

      if (validElements.length === 0) {
        throw new Error('Elemen dokumen tidak ditemukan.');
      }

      await downloadModulePdf(validElements, `Modul-Resep-Kulkas-${moduleData.cover.title}`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err: any) {
      console.error('PDF error:', err);
      setErrorMessage('Gagal membuat file PDF. Silakan gunakan tombol "Cetak Dokumen" sebagai alternatif.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setModuleData(null);
    setSelectedImage(null);
    setErrorMessage(null);
    setDownloadSuccess(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Header bar (no-print) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              🥗
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                  Resep Kulkas
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Generator
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pendeteksi Bahan Foto Kulkas & Pembuat Dokumen Edukasi Siap Cetak (PDF)
              </p>
            </div>
          </div>

          {moduleData && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                {isGeneratingPdf ? 'Membuat PDF...' : 'Unduh Dokumen PDF'}
              </button>
              <button
                onClick={handlePrint}
                className="hidden sm:flex bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-semibold px-3 py-2 rounded-lg items-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Cetak
              </button>
              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                title="Ganti Foto"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 shadow-xs no-print">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600 text-sm font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Download Success Banner */}
        {downloadSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-xs no-print">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-sm font-medium">
              Dokumen PDF berhasil dibuat dan diunduh ke perangkat Anda! Siap dicetak untuk panduan dapur.
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: UPLOAD & PHOTO SELECTION FORM (when no moduleData) */}
        {/* ======================================================== */}
        {!moduleData && (
          <div className="max-w-3xl mx-auto space-y-6 no-print">
            {/* Intro Hero Card */}
            <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Kecerdasan Buatan Deteksi Isi Kulkas
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Ubah Bahan di Kulkas Menjadi Modul Masak Siap Cetak
              </h2>
              <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
                Cukup unggah satu foto isi kulkas Anda. Program akan mendeteksi seluruh bahan makanan,
                menyusun materi edukasi nutrisi & tips penyimpanan awet, serta menghasilkan resep masakan kreatif
                yang langsung dibungkus rapi dalam dokumen PDF.
              </p>
            </div>

            {/* Photo Input Box */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  Langkah 1: Masukkan Foto Kulkas
                </h3>
                {selectedImage && (
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                  >
                    Hapus Pilihan
                  </button>
                )}
              </div>

              {/* Camera Active View */}
              {isCameraActive ? (
                <div className="rounded-xl overflow-hidden border-2 border-emerald-500 bg-black flex flex-col items-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-h-80 object-cover"
                  />
                  <div className="p-4 bg-slate-900 w-full flex items-center justify-center gap-4">
                    <button
                      onClick={capturePhoto}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Ambil Foto Sekarang
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm px-4 py-2.5 rounded-full cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : selectedImage ? (
                /* Selected Image Preview */
                <div className="relative rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/30 p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-40 h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 shadow-xs">
                    <img
                      src={selectedImage}
                      alt="Pratinjau Kulkas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Foto Kulkas Berhasil Dipilih
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Foto siap dianalisis untuk mendeteksi bahan makanan dan menghasilkan modul panduan memasak edukatif.
                    </p>
                    <div className="mt-3 flex gap-2 justify-center sm:justify-start">
                      <label className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium border border-slate-300 cursor-pointer transition-colors">
                        Ganti Foto
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <button
                        onClick={startCamera}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium border border-slate-300 cursor-pointer transition-colors"
                      >
                        Buka Kamera
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Upload Dropzone & Camera Trigger */
                <div className="space-y-4">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">
                      Tarik & jatuhkan foto kulkas di sini, atau pilih file
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Mendukung format JPG, PNG, atau WEBP foto bagian dalam kulkas
                    </p>

                    <div className="mt-4 flex items-center justify-center gap-3">
                      <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs">
                        Pilih File Foto
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Gunakan Kamera
                      </button>
                    </div>
                  </div>

                  {/* Sample Photos for Quick 1-Click Testing */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-600">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Atau pilih contoh foto kulkas untuk uji coba instan:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {SAMPLE_FRIDGE_PHOTOS.map((sample) => (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => handleSelectSample(sample)}
                          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/20 text-left transition-all group cursor-pointer shadow-2xs"
                        >
                          <div className="h-16 w-full rounded-md overflow-hidden bg-slate-100 mb-2 border border-slate-200">
                            <img
                              src={sample.dataUrl}
                              alt={sample.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="text-xs font-bold text-slate-800 line-clamp-1">
                            {sample.title}
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            {sample.ingredientsPreview.join(', ')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Culinary Preferences */}
              <div className="border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    Preferensi Tambahan (Opsional)
                  </span>
                  <span className="text-slate-400">
                    {showPreferences ? 'Tutup' : 'Buka'}
                  </span>
                </button>

                {showPreferences && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Contoh: Tanpa pedas, untuk bekal sekolah anak, vegetarian, atau rendah garam..."
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Cepat (<20 menit)',
                        'Ramah Anak',
                        'Menu Berkuah Hangat',
                        'Tanpa Pedas',
                        'Tinggi Protein',
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setPreferences(chip)}
                          className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded cursor-pointer transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button: Generate Culinary Guide Module */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateModule}
                  disabled={!selectedImage || isProcessing}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    !selectedImage || isProcessing
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Mulai Pindai & Buat Modul PDF Siap Cetak
                </button>
              </div>
            </div>

            {/* Explanation of the 4 Mandatory Module Components */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Isi Modul Kuliner Edukatif yang Dihasilkan:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Cover Halaman</h5>
                    <p className="text-slate-500 mt-0.5">
                      Judul menarik, sub-judul, dan deskripsi ilustrasi representatif tentang tema kuliner.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Daftar Bahan Terdeteksi</h5>
                    <p className="text-slate-500 mt-0.5">
                      Identifikasi lengkap bahan makanan di kulkas beserta kondisi dan kategori.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Panduan Edukasi Bahan</h5>
                    <p className="text-slate-500 mt-0.5">
                      Kandungan nutrisi bermanfaat, tips penyimpanan awet, dan edukasi anti-food waste.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Resep Masakan Kreatif</h5>
                    <p className="text-slate-500 mt-0.5">
                      1-2 menu kreatif lengkap dengan waktu, tingkat kesulitan, takaran, dan langkah rapi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PROCESSING & SCANNING ANIMATION STATE                     */}
        {/* ======================================================== */}
        {isProcessing && (
          <div className="max-w-md mx-auto my-16 bg-white rounded-2xl p-8 border border-slate-200 shadow-lg text-center no-print">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-4 animate-pulse">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Sedang Menganalisis Isi Kulkas...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Kecerdasan buatan sedang memeriksa foto kulkas dan menyusun dokumen edukasi kuliner.
            </p>

            <div className="mt-6 space-y-3 text-left">
              {[
                { step: 1, label: 'Memindai visual foto isi kulkas' },
                { step: 2, label: 'Mendeteksi bahan & kondisi penyimpanan' },
                { step: 3, label: 'Menyusun materi edukasi gizi & resep kreatif' },
                { step: 4, label: 'Menyiapkan dokumen siap cetak PDF' },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`flex items-center gap-3 text-xs p-2.5 rounded-lg transition-colors ${
                    processingStep >= item.step
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      processingStep >= item.step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {processingStep > item.step ? '✓' : item.step}
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: GENERATED DOCUMENT READY FOR PDF DOWNLOAD / PRINT */}
        {/* ======================================================== */}
        {moduleData && !isProcessing && (
          <div className="space-y-6">
            {/* Sticky Action Bar */}
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-18 z-30 no-print">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  📄
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                      Dokumen Siap Cetak
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Format PDF
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm md:text-base">
                    {moduleData.cover.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  {isGeneratingPdf ? 'Membuat File PDF...' : 'Unduh Dokumen PDF (Siap Cetak)'}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Dokumen
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs md:text-sm px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Ganti Foto
                </button>
              </div>
            </div>

            {/* Document Preview Banner info */}
            <div className="bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>
                  Pratinjau di bawah ini dirancang presisi sesuai ukuran standar cetak A4. Seluruh materi edukasi, daftar bahan, dan resep telah terintegrasi dalam modul.
                </span>
              </div>
              <span className="font-bold text-amber-800 text-[11px] whitespace-nowrap ml-2">
                {2 + moduleData.recipes.length} Halaman Lengkap
              </span>
            </div>

            {/* The multi-page printable document itself */}
            <DocumentPages
              moduleData={moduleData}
              uploadedImagePreview={selectedImage}
              pageRefs={pageRefs}
            />

            {/* Bottom Download Bar for convenience */}
            <div className="text-center py-6 border-t border-slate-200 no-print flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                {isGeneratingPdf ? 'Membuat File PDF...' : 'Unduh Dokumen PDF (Siap Cetak)'}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm px-5 py-3 rounded-xl flex items-center gap-2 border border-slate-300 cursor-pointer shadow-2xs"
              >
                <Printer className="w-4 h-4" />
                Cetak Melalui Dialog Browser
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Aplikasi Resep Kulkas &copy; {new Date().getFullYear()} • Sistem Cerdas Generator Resep & Modul Kuliner Siap Cetak
          </span>
          <span className="text-emerald-700 font-medium">
            Format Dokumen Siap Cetak & Edukasi Anti-Food Waste
          </span>
        </div>
      </footer>
    </div>
  );
}
