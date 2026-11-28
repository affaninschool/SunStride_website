export const TECH_SPEC_PDF_URL =
  '/assets/aistudio/SunStride_Smart_Station_-_Technical_Specification_e4cdbc10.pdf';

export const TECH_SPEC_PDF_FILENAME =
  'SunStride_Smart_Station_-_Technical_Specification.pdf';

export function downloadOnePageSpecPdf(): void {
  const link = document.createElement('a');
  link.href = TECH_SPEC_PDF_URL;
  link.download = TECH_SPEC_PDF_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
