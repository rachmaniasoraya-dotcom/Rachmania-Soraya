// Sample refrigerator images rendered as crisp data URLs for instant one-click testing
export interface SamplePhoto {
  id: string;
  title: string;
  description: string;
  ingredientsPreview: string[];
  dataUrl: string;
}

// Generate stylized realistic refrigerator illustration SVGs converted to data URLs
function createFridgeSvg(theme: 'veggie' | 'protein' | 'fresh'): string {
  let content = '';
  if (theme === 'veggie') {
    content = `
      <rect width="600" height="400" fill="#f0fdf4"/>
      <!-- Fridge interior racks -->
      <rect x="30" y="20" width="540" height="360" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
      <line x1="30" y1="140" x2="570" y2="140" stroke="#94a3b8" stroke-width="4"/>
      <line x1="30" y1="260" x2="570" y2="260" stroke="#94a3b8" stroke-width="4"/>
      
      <!-- Top shelf: Milk and Eggs -->
      <rect x="70" y="50" width="45" height="80" rx="6" fill="#3b82f6"/>
      <text x="92" y="95" font-family="sans-serif" font-size="12" fill="#ffffff" font-weight="bold" text-anchor="middle">SUSU</text>
      <!-- Egg carton -->
      <rect x="140" y="90" width="120" height="40" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="165" cy="110" r="10" fill="#fde047"/>
      <circle cx="195" cy="110" r="10" fill="#fde047"/>
      <circle cx="225" cy="110" r="10" fill="#fde047"/>
      <text x="200" y="80" font-family="sans-serif" font-size="11" fill="#713f12" font-weight="bold" text-anchor="middle">Telur Ayam Segar</text>

      <!-- Cheese / Butter -->
      <polygon points="300,130 360,130 380,95 320,95" fill="#facc15" stroke="#eab308" stroke-width="2"/>
      <text x="340" y="115" font-family="sans-serif" font-size="11" fill="#854d0e" font-weight="bold" text-anchor="middle">Keju</text>

      <!-- Middle shelf: Vegetables -->
      <rect x="60" y="180" width="130" height="70" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <path d="M 80,240 Q 110,190 140,240 Q 170,190 180,240" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <text x="125" y="215" font-family="sans-serif" font-size="11" fill="#14532d" font-weight="bold" text-anchor="middle">Bayam & Selada</text>

      <!-- Carrots -->
      <polygon points="230,230 310,245 280,255" fill="#f97316"/>
      <polygon points="240,210 320,225 290,235" fill="#fb923c"/>
      <text x="275" y="195" font-family="sans-serif" font-size="11" fill="#9a3412" font-weight="bold" text-anchor="middle">Wortel Organik</text>

      <!-- Tofu container -->
      <rect x="360" y="185" width="90" height="65" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
      <rect x="375" y="200" width="30" height="40" fill="#fef9c3" stroke="#e2e8f0"/>
      <rect x="410" y="200" width="30" height="40" fill="#fef9c3" stroke="#e2e8f0"/>
      <text x="405" y="197" font-family="sans-serif" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Tahu Putih</text>

      <!-- Bottom crisper drawer -->
      <rect x="50" y="280" width="500" height="85" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="100" cy="325" r="22" fill="#ef4444"/>
      <circle cx="140" cy="325" r="20" fill="#ef4444"/>
      <text x="120" y="360" font-family="sans-serif" font-size="11" fill="#991b1b" font-weight="bold" text-anchor="middle">Tomat Segar</text>

      <circle cx="220" cy="325" r="24" fill="#a855f7"/>
      <text x="220" y="360" font-family="sans-serif" font-size="11" fill="#581c87" font-weight="bold" text-anchor="middle">Terong Ungu</text>

      <!-- Garlic & Onion bowl -->
      <ellipse cx="330" cy="330" rx="35" ry="18" fill="#e2e8f0" stroke="#94a3b8"/>
      <circle cx="320" cy="322" r="10" fill="#ffffff" stroke="#cbd5e1"/>
      <circle cx="335" cy="320" r="11" fill="#ffffff" stroke="#cbd5e1"/>
      <circle cx="345" cy="324" r="9" fill="#fca5a5" stroke="#f87171"/>
      <text x="330" y="360" font-family="sans-serif" font-size="11" fill="#334155" font-weight="bold" text-anchor="middle">Bawang & Cabai</text>

      <!-- Sauce bottle on right door side preview -->
      <rect x="480" y="170" width="30" height="80" rx="4" fill="#78350f"/>
      <rect x="488" y="155" width="14" height="15" fill="#f59e0b"/>
      <text x="495" y="215" font-family="sans-serif" font-size="9" fill="#fef3c7" font-weight="bold" text-anchor="middle">Kecap</text>
    `;
  } else if (theme === 'protein') {
    content = `
      <rect width="600" height="400" fill="#eff6ff"/>
      <rect x="30" y="20" width="540" height="360" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
      <line x1="30" y1="140" x2="570" y2="140" stroke="#94a3b8" stroke-width="4"/>
      <line x1="30" y1="260" x2="570" y2="260" stroke="#94a3b8" stroke-width="4"/>

      <!-- Shelf 1: Chicken Breast & Mushrooms -->
      <rect x="60" y="55" width="150" height="70" rx="8" fill="#fff1f2" stroke="#f43f5e" stroke-width="2"/>
      <ellipse cx="135" cy="90" rx="55" ry="20" fill="#fecdd3"/>
      <text x="135" y="95" font-family="sans-serif" font-size="12" fill="#9f1239" font-weight="bold" text-anchor="middle">Dada Ayam Fillet</text>

      <!-- Mushroom container -->
      <rect x="240" y="65" width="110" height="60" rx="6" fill="#f5f5f4" stroke="#78716c" stroke-width="2"/>
      <ellipse cx="270" cy="95" rx="12" ry="8" fill="#e7e5e4" stroke="#a8a29e"/>
      <ellipse cx="300" cy="90" rx="14" ry="9" fill="#e7e5e4" stroke="#a8a29e"/>
      <ellipse cx="325" cy="100" rx="11" ry="7" fill="#e7e5e4" stroke="#a8a29e"/>
      <text x="295" y="80" font-family="sans-serif" font-size="11" fill="#44403c" font-weight="bold" text-anchor="middle">Jamur Kancing</text>

      <!-- Milk carton -->
      <rect x="390" y="45" width="45" height="85" rx="4" fill="#38bdf8"/>
      <text x="412" y="95" font-family="sans-serif" font-size="11" fill="#ffffff" font-weight="bold" text-anchor="middle">SUSU</text>

      <!-- Shelf 2: Paprika, Butter, Garlic -->
      <ellipse cx="110" cy="205" rx="22" ry="26" fill="#dc2626"/>
      <path d="M 110,180 Q 115,170 120,165" stroke="#16a34a" stroke-width="4" fill="none"/>
      <text x="110" y="245" font-family="sans-serif" font-size="11" fill="#7f1d1d" font-weight="bold" text-anchor="middle">Paprika Merah</text>

      <rect x="180" y="180" width="90" height="50" rx="4" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
      <text x="225" y="210" font-family="sans-serif" font-size="11" fill="#854d0e" font-weight="bold" text-anchor="middle">Mentega</text>

      <!-- Cheddar Cheese block -->
      <rect x="300" y="175" width="85" height="55" rx="4" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <text x="342" y="208" font-family="sans-serif" font-size="11" fill="#78350f" font-weight="bold" text-anchor="middle">Keju Cheddar</text>

      <!-- Eggs in rack -->
      <rect x="420" y="190" width="100" height="40" rx="6" fill="#fef9c3" stroke="#facc15" stroke-width="2"/>
      <circle cx="445" cy="208" r="9" fill="#fde047"/>
      <circle cx="470" cy="208" r="9" fill="#fde047"/>
      <circle cx="495" cy="208" r="9" fill="#fde047"/>
      <text x="470" y="182" font-family="sans-serif" font-size="10" fill="#854d0e" font-weight="bold" text-anchor="middle">Telur (4 btr)</text>

      <!-- Crisper drawer -->
      <rect x="50" y="280" width="500" height="85" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <ellipse cx="140" cy="325" rx="35" ry="20" fill="#86efac"/>
      <text x="140" y="330" font-family="sans-serif" font-size="11" fill="#166534" font-weight="bold" text-anchor="middle">Brokoli Segar</text>

      <circle cx="270" cy="325" r="20" fill="#facc15"/>
      <circle cx="310" cy="325" r="18" fill="#facc15"/>
      <text x="290" y="358" font-family="sans-serif" font-size="11" fill="#713f12" font-weight="bold" text-anchor="middle">Lemon</text>

      <rect x="380" y="295" width="90" height="55" rx="6" fill="#fed7aa" stroke="#f97316" stroke-width="2"/>
      <text x="425" y="328" font-family="sans-serif" font-size="11" fill="#9a3412" font-weight="bold" text-anchor="middle">Wortel Baby</text>
    `;
  } else {
    content = `
      <rect width="600" height="400" fill="#fffbeb"/>
      <rect x="30" y="20" width="540" height="360" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
      <line x1="30" y1="140" x2="570" y2="140" stroke="#94a3b8" stroke-width="4"/>
      <line x1="30" y1="260" x2="570" y2="260" stroke="#94a3b8" stroke-width="4"/>

      <!-- Shelf 1: Tempe & Ikan -->
      <rect x="70" y="65" width="120" height="55" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="130" y="98" font-family="sans-serif" font-size="12" fill="#92400e" font-weight="bold" text-anchor="middle">Tempe Kedelai</text>

      <rect x="220" y="60" width="140" height="65" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <ellipse cx="290" cy="92" rx="45" ry="16" fill="#bae6fd"/>
      <text x="290" y="97" font-family="sans-serif" font-size="11" fill="#0369a1" font-weight="bold" text-anchor="middle">Fillet Ikan Kakap</text>

      <!-- Tofu -->
      <rect x="390" y="65" width="90" height="55" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <text x="435" y="98" font-family="sans-serif" font-size="11" fill="#334155" font-weight="bold" text-anchor="middle">Tahu Kuning</text>

      <!-- Shelf 2: Cabai, Bawang, Tomat, Kangkung -->
      <rect x="60" y="175" width="130" height="65" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="125" y="212" font-family="sans-serif" font-size="12" fill="#14532d" font-weight="bold" text-anchor="middle">1 Ikat Kangkung</text>

      <ellipse cx="240" cy="210" rx="35" ry="18" fill="#fee2e2" stroke="#ef4444"/>
      <circle cx="230" cy="205" r="5" fill="#dc2626"/>
      <circle cx="245" cy="210" r="5" fill="#dc2626"/>
      <circle cx="255" cy="203" r="5" fill="#dc2626"/>
      <text x="240" y="245" font-family="sans-serif" font-size="11" fill="#991b1b" font-weight="bold" text-anchor="middle">Cabai Rawit Merah</text>

      <circle cx="330" cy="205" r="18" fill="#ef4444"/>
      <circle cx="365" cy="205" r="16" fill="#ef4444"/>
      <text x="348" y="242" font-family="sans-serif" font-size="11" fill="#991b1b" font-weight="bold" text-anchor="middle">Tomat Buah</text>

      <!-- Eggs -->
      <rect x="420" y="185" width="100" height="45" rx="6" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
      <circle cx="445" cy="208" r="9" fill="#facc15"/>
      <circle cx="470" cy="208" r="9" fill="#facc15"/>
      <circle cx="495" cy="208" r="9" fill="#facc15"/>
      <text x="470" y="178" font-family="sans-serif" font-size="10" fill="#713f12" font-weight="bold" text-anchor="middle">Telur Ayam</text>

      <!-- Crisper: Jagung Manis, Jeruk Nipis, Timun -->
      <rect x="50" y="280" width="500" height="85" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="80" y="300" width="110" height="35" rx="10" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <text x="135" y="322" font-family="sans-serif" font-size="11" fill="#854d0e" font-weight="bold" text-anchor="middle">Jagung Manis</text>

      <circle cx="250" cy="320" r="16" fill="#84cc16"/>
      <circle cx="285" cy="320" r="15" fill="#84cc16"/>
      <text x="268" y="355" font-family="sans-serif" font-size="11" fill="#365314" font-weight="bold" text-anchor="middle">Jeruk Nipis</text>

      <rect x="360" y="305" width="110" height="28" rx="8" fill="#22c55e"/>
      <text x="415" y="324" font-family="sans-serif" font-size="11" fill="#ffffff" font-weight="bold" text-anchor="middle">Timun Segar</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">${content}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_FRIDGE_PHOTOS: SamplePhoto[] = [
  {
    id: 'sample-veggie-tofu',
    title: 'Kulkas Dapur Sehat (Sayur & Tahu)',
    description: 'Bayam segar, telur, tahu putih, wortel, keju, susu, dan tomat di rak dingin.',
    ingredientsPreview: ['Bayam / Selada', 'Telur Ayam', 'Tahu Putih', 'Wortel', 'Keju', 'Susu'],
    dataUrl: createFridgeSvg('veggie'),
  },
  {
    id: 'sample-protein-shroom',
    title: 'Kulkas Protein & Jamur (Gourmet)',
    description: 'Dada ayam fillet, jamur kancing, paprika merah, brokoli, keju cheddar, dan mentega.',
    ingredientsPreview: ['Dada Ayam Fillet', 'Jamur Kancing', 'Paprika Merah', 'Brokoli', 'Keju Cheddar'],
    dataUrl: createFridgeSvg('protein'),
  },
  {
    id: 'sample-nusantara-tempe',
    title: 'Kulkas Nusantara (Tempe, Kangkung & Ikan)',
    description: 'Tempe kedelai, kangkung, fillet ikan, cabai rawit, jagung manis, dan telur.',
    ingredientsPreview: ['Tempe Kedelai', 'Kangkung Segar', 'Fillet Ikan', 'Cabai Rawit', 'Jagung Manis'],
    dataUrl: createFridgeSvg('fresh'),
  },
];
