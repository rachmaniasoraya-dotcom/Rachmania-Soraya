import React from 'react';
import { RecipeGuideModule } from '../types/recipe';
import {
  BookOpen,
  Calendar,
  ChefHat,
  Clock,
  Flame,
  Info,
  Leaf,
  Sparkles,
  ShieldCheck,
  Users,
  Utensils,
  Lightbulb,
} from 'lucide-react';

interface DocumentPagesProps {
  moduleData: RecipeGuideModule;
  uploadedImagePreview?: string | null;
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const DocumentPages: React.FC<DocumentPagesProps> = ({
  moduleData,
  uploadedImagePreview,
  pageRefs,
}) => {
  const { cover, detectedIngredients, educationGuide, recipes } = moduleData;

  const totalPages = 2 + recipes.length;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto my-6 print:m-0 print:p-0 print:gap-0">
      {/* ======================================================== */}
      {/* HALAMAN 1: COVER DOKUMEN MODUL EDUKASI                   */}
      {/* ======================================================== */}
      <div
        ref={(el) => {
          pageRefs.current[0] = el;
        }}
        className="w-full bg-white text-slate-800 shadow-xl rounded-xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none page-break-after"
        style={{ minHeight: '1050px' }}
      >
        <div className="p-10 md:p-14 flex flex-col justify-between h-full bg-gradient-to-b from-emerald-50/60 via-white to-amber-50/40">
          {/* Header Bar */}
          <div>
            <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  🥗
                </div>
                <div>
                  <h3 className="font-extrabold text-emerald-800 tracking-wider text-sm uppercase">
                    Aplikasi Resep Kulkas
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Modul Panduan Memasak Edukatif Siap Cetak
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-200">
                  {cover.editionBadge || 'Edisi Panduan Dapur Pintar'}
                </span>
                <p className="text-xs text-slate-400 mt-1 flex items-center justify-end gap-1">
                  <Calendar className="w-3 h-3" />
                  {cover.dateGenerated || new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </p>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-12 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm border border-amber-200">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Materi Edukasi & Pengolahan Bahan Kulkas
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {cover.title}
              </h1>
              <p className="text-base md:text-lg text-slate-600 mt-4 leading-relaxed font-normal">
                {cover.subtitle}
              </p>
            </div>
          </div>

          {/* Central Cover Illustration & Visual Presentation */}
          <div className="my-8">
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Photo thumbnail if available */}
                {uploadedImagePreview && (
                  <div className="w-full md:w-5/12 flex-shrink-0">
                    <div className="relative rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100 aspect-video md:aspect-square flex items-center justify-center">
                      <img
                        src={uploadedImagePreview}
                        alt="Foto Kulkas Asli"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md">
                        Foto Isi Kulkas Terdeteksi
                      </div>
                    </div>
                  </div>
                )}

                {/* Cover Illustration Description Card */}
                <div className={`w-full ${uploadedImagePreview ? 'md:w-7/12' : 'max-w-2xl mx-auto text-center'}`}>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-wider mb-2">
                    <BookOpen className="w-4 h-4" />
                    Gambaran & Tema Modul Kuliner
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
                    &ldquo;{cover.coverIllustrationDescription}&rdquo;
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-lg font-bold text-emerald-700">
                        {detectedIngredients.length}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">Bahan Ditemukan</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-lg font-bold text-amber-700">
                        {recipes.length}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">Resep Kreasi</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-lg font-bold text-blue-700">100%</div>
                      <div className="text-[11px] text-slate-500 font-medium">Siap Cetak PDF</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Footer */}
          <div className="border-t border-slate-200 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dihasilkan secara otomatis untuk edukasi keluarga & cegah food-waste</span>
            </div>
            <div className="mt-2 md:mt-0 font-medium text-slate-600">
              Halaman 1 dari {totalPages}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* HALAMAN 2: DAFTAR BAHAN TERDETEKSI & PANDUAN EDUKASI      */}
      {/* ======================================================== */}
      <div
        ref={(el) => {
          pageRefs.current[1] = el;
        }}
        className="w-full bg-white text-slate-800 shadow-xl rounded-xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none page-break-after"
        style={{ minHeight: '1050px' }}
      >
        <div className="p-10 md:p-14 flex flex-col justify-between h-full">
          <div>
            {/* Page Header */}
            <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Komponen 2 & 3
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                  Inventaris Bahan & Edukasi Penyimpanan
                </h2>
              </div>
              <div className="text-right text-xs text-slate-400">
                Resep Kulkas • Modul Edukasi
              </div>
            </div>

            {/* Section 2: Daftar Bahan Terdeteksi */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Bahan Makanan Terdeteksi dari Foto Kulkas
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-emerald-50/80 text-emerald-900 border-b border-emerald-200">
                      <th className="py-2.5 px-3 font-semibold w-12 text-center">No</th>
                      <th className="py-2.5 px-3 font-semibold">Nama Bahan</th>
                      <th className="py-2.5 px-3 font-semibold">Kategori</th>
                      <th className="py-2.5 px-3 font-semibold">Kondisi / Estimasi</th>
                      <th className="py-2.5 px-3 font-semibold">Tips Simpan Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {detectedIngredients.map((ing, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                        <td className="py-2 px-3 text-center font-medium text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {ing.name}
                        </td>
                        <td className="py-2 px-3">
                          <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium border border-slate-200">
                            {ing.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {ing.estimatedQuantityOrCondition}
                        </td>
                        <td className="py-2 px-3 text-emerald-800 text-xs">
                          {ing.storageAdvice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Materi Panduan Memaksimalkan Bahan */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Materi Panduan Edukasi: {educationGuide.themeTitle || 'Optimalisasi Bahan & Gizi'}
                </h3>
              </div>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4 bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-100">
                {educationGuide.introSummary}
              </p>

              {/* Grid 2 Columns: Tips Penyimpanan & Fakta Nutrisi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tips Penyimpanan Awet */}
                <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide mb-3">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    Tips Simpan Agar Awet & Tetap Segar
                  </h4>
                  <div className="space-y-2.5">
                    {educationGuide.storageTips.map((tip, idx) => (
                      <div key={idx} className="bg-white/90 p-2.5 rounded-lg border border-amber-100 text-xs shadow-xs">
                        <div className="font-semibold text-amber-950">{tip.title}</div>
                        <div className="text-slate-600 mt-0.5 leading-snug">{tip.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fakta Nutrisi & Gizi */}
                <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200/80">
                  <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5 uppercase tracking-wide mb-3">
                    <Info className="w-4 h-4 text-blue-700" />
                    Kandungan Gizi & Manfaat Bahan Utama
                  </h4>
                  <div className="space-y-2.5">
                    {educationGuide.nutritionFacts.map((fact, idx) => (
                      <div key={idx} className="bg-white/90 p-2.5 rounded-lg border border-blue-100 text-xs shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-950">{fact.ingredient}</span>
                          <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            {fact.highlightNutrient}
                          </span>
                        </div>
                        <div className="text-slate-600 mt-1 leading-snug">{fact.healthBenefit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Anti Food Waste Tip Banner */}
              <div className="mt-4 bg-emerald-700 text-white rounded-xl p-3.5 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 flex-shrink-0 text-amber-300 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-amber-200 uppercase tracking-wide mr-1">
                    Tips Anti Food-Waste:
                  </span>
                  {educationGuide.antiFoodWasteTip}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500 mt-6">
            <span>Aplikasi Resep Kulkas • Materi Panduan Edukatif</span>
            <span className="font-medium text-slate-600">Halaman 2 dari {totalPages}</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* HALAMAN 3+: RESEP MASAKAN KREATIF                         */}
      {/* ======================================================== */}
      {recipes.map((recipe, rIdx) => {
        const pageNumber = 3 + rIdx;
        return (
          <div
            key={rIdx}
            ref={(el) => {
              pageRefs.current[2 + rIdx] = el;
            }}
            className="w-full bg-white text-slate-800 shadow-xl rounded-xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none page-break-after"
            style={{ minHeight: '1050px' }}
          >
            <div className="p-10 md:p-14 flex flex-col justify-between h-full bg-gradient-to-b from-white via-white to-slate-50/50">
              <div>
                {/* Recipe Header */}
                <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Komponen 4: Resep Masakan Kreatif #{rIdx + 1}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                      {recipe.menuName}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 mt-0.5 italic">
                      {recipe.tagline}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-2xl shadow-xs">
                    🍳
                  </div>
                </div>

                {/* Badges / Metrics Bar */}
                <div className="grid grid-cols-3 gap-3 my-4 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-xs text-emerald-950 font-semibold justify-center">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Waktu: {recipe.cookingTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-950 font-semibold justify-center border-x border-emerald-200">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Tingkat: {recipe.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-950 font-semibold justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Porsi: {recipe.servings}</span>
                  </div>
                </div>

                {/* 2-Column Content: Ingredients on Left, Steps on Right */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
                  {/* Left Column: Ingredients */}
                  <div className="md:col-span-5 space-y-4">
                    {/* Main fridge ingredients */}
                    <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80">
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                        Bahan Dari Kulkas (Utama)
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {recipe.mainIngredients.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pantry & seasoning ingredients */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <ChefHat className="w-3.5 h-3.5 text-slate-500" />
                        Bahan Dapur Pendukung
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {recipe.pantryIngredients.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-slate-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Ordered Steps */}
                  <div className="md:col-span-7">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Langkah-Langkah Pembuatan yang Rapi
                    </h4>

                    <div className="space-y-3">
                      {recipe.steps.map((st) => (
                        <div
                          key={st.stepNumber}
                          className="flex items-start gap-3 bg-white p-2.5 rounded-lg border border-slate-200 text-xs shadow-2xs"
                        >
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {st.stepNumber}
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-800 leading-snug">{st.instruction}</p>
                            {st.proTip && (
                              <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-1 rounded mt-1.5 border border-amber-200/60 font-medium">
                                💡 Tip Koki: {st.proTip}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chef Note Card */}
                <div className="mt-6 bg-gradient-to-r from-amber-50 via-amber-50/50 to-emerald-50/40 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-3">
                    <ChefHat className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                        Catatan Koki & Saran Penyajian Edukatif
                      </h5>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {recipe.chefNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Footer */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500 mt-6">
                <span>Resep Kulkas • Menu Kreatif #{rIdx + 1}</span>
                <span className="font-medium text-slate-600">
                  Halaman {pageNumber} dari {totalPages}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
