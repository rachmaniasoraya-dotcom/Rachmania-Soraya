import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads a clean A4 PDF document composed of distinct printable pages.
 */
export async function downloadModulePdf(
  pageElements: HTMLElement[],
  title = 'Modul-Resep-Kulkas'
): Promise<void> {
  if (!pageElements || pageElements.length === 0) {
    throw new Error('Tidak ada halaman dokumen yang dapat dicetak.');
  }

  // Standard A4 dimensions in millimeters
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  for (let i = 0; i < pageElements.length; i++) {
    const element = pageElements[i];

    // Temporarily ensure styles are rendered without clipping
    const canvas = await html2canvas(element, {
      scale: 2, // 2x scale for crisp, high-resolution print quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  pdf.save(`${sanitizedTitle || 'modul-resep-kulkas'}.pdf`);
}
