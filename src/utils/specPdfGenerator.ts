import { HARDWARE_BOM, PROJECT_CONTACT } from '../data/projectData';

function escapePdfText(text: string): string {
  return text
    .replace(/[^\x20-\x7E]/g, '-')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

export function downloadOnePageSpecPdf(): void {
  const totalBomCost = HARDWARE_BOM.reduce((sum, item) => sum + item.qty * item.unitCostInr, 0);

  const lines: { text: string; size: number; bold?: boolean; gap?: number; color?: [number, number, number] }[] = [
    { text: 'SUNSTRIDE SMART STATION - 1-PAGE TECHNICAL SPECIFICATION', size: 14, bold: true, gap: 18, color: [0.06, 0.09, 0.12] },
    { text: 'Working ATL Prototype: ESP8266 + RFID Bus Tracking + Solar/Piezo Station Power', size: 9.5, bold: true, gap: 16, color: [0.04, 0.45, 0.30] },
    { text: `School: ${PROJECT_CONTACT.school} (${PROJECT_CONTACT.lab})`, size: 8.5, gap: 12 },
    { text: `Creator: ${PROJECT_CONTACT.creator} | Mentor: ${PROJECT_CONTACT.mentor} | Contact: ${PROJECT_CONTACT.email}`, size: 8.5, gap: 16 },

    { text: '1. SYSTEM ARCHITECTURE & OFFLINE OPERATION', size: 10.5, bold: true, gap: 14, color: [0.06, 0.09, 0.12] },
    { text: '- Bus Detection: Passive 13.56 MHz Mifare 1K RFID tags scanned by MFRC522 reader over SPI (<100 ms).', size: 8.5, gap: 11 },
    { text: '- Local Dashboard: ESP8266 NodeMCU hosts an offline Wi-Fi SoftAP ("SunStride-Station") HTTP portal.', size: 8.5, gap: 11 },
    { text: '- Commuter Output: Live status pushed to local browser dashboard + station OLED / green-red LED + buzzer.', size: 8.5, gap: 11 },
    { text: '- Prototype Qualification: Identifies registered tagged buses; does not independently infer route/destination.', size: 8.5, gap: 15, color: [0.55, 0.28, 0.02] },

    { text: '2. HARDWARE WIRING PINOUT (ESP8266 NODEMCU + MFRC522 + FEEDBACK)', size: 10.5, bold: true, gap: 14, color: [0.06, 0.09, 0.12] },
    { text: 'MFRC522 3.3V -> 3V3 | RST -> D3 (GPIO0) | GND -> GND | MISO -> D6 (GPIO12) | MOSI -> D7 (GPIO13)', size: 8.2, gap: 11 },
    { text: 'MFRC522 SCK  -> D5 (GPIO14) | SDA(SS) -> D8 (GPIO15) | Buzzer -> D1 (GPIO5) | LEDs -> D2/D4 | Vin -> 5V Bank', size: 8.2, gap: 15 },

    { text: '3. BILL OF MATERIALS (ATL PROTOTYPE BUDGET)', size: 10.5, bold: true, gap: 14, color: [0.06, 0.09, 0.12] },
    ...HARDWARE_BOM.map((item) => ({
      text: `- ${item.part} (x${item.qty}) [${item.spec}] : INR ${item.qty * item.unitCostInr} (${item.status})`,
      size: 8.2,
      gap: 11,
    })),
    { text: `TOTAL BENCH PROTOTYPE COST: INR ${totalBomCost} (vs Commercial Smart Kiosks: INR 1,50,000+)`, size: 9, bold: true, gap: 16, color: [0.04, 0.45, 0.30] },

    { text: '4. ENERGY REALISM MATRIX (STRICT SCALE BOUNDARIES)', size: 10.5, bold: true, gap: 14, color: [0.06, 0.09, 0.12] },
    { text: '- SunTrack (Conceptual Solar Tracking): 10-50 W scale | Primary station electronics & display power.', size: 8.2, gap: 11 },
    { text: '- StepVolt (Piezo Footstep Tiles): 0.1-2 mJ/step | Ultra-low intermittent pulses; requires practical field testing.', size: 8.2, gap: 11 },
    { text: '- RoadVolt (Speed-Breaker Dynamo): 1-5 Wh/vehicle | Conceptual road installation; requires safety/durability audit.', size: 8.2, gap: 11 },
    { text: '- BrakeBack (Regen Braking): 50-200 kJ/stop | Vehicle-level traction recovery; not station RFID hardware.', size: 8.2, gap: 14 },

    { text: '5. VERIFICATION & CREDITS', size: 10.5, bold: true, gap: 14, color: [0.06, 0.09, 0.12] },
    { text: 'Portfolio: https://affanadil.lovable.app/ | Mentor: https://mrinmoychowhan.lovable.app/', size: 8.2, gap: 11 },
    { text: 'Live Dashboard: https://affaninschool.github.io/SunStride_Dashboard/', size: 8.2, gap: 11 },
  ];

  // Build PDF content stream (Letter 612 x 792 pt)
  let streamCommands = 'BT\n';
  let y = 748;
  // Header accent rule
  const headerBar = '0.06 0.09 0.12 rg 36 768 540 4 re f\n0.06 0.58 0.38 rg 36 765 180 3 re f\n';

  lines.forEach((line) => {
    const fontKey = line.bold ? '/F2' : '/F1';
    const [r, g, b] = line.color || [0.15, 0.17, 0.20];
    streamCommands += `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg\n`;
    streamCommands += `${fontKey} ${line.size} Tf\n`;
    streamCommands += `1 0 0 1 40 ${y} Tm\n`;
    streamCommands += `(${escapePdfText(line.text)}) Tj\n`;
    y -= line.gap || 12;
  });

  streamCommands += 'ET\n';
  const fullStream = headerBar + streamCommands;

  const encoder = new TextEncoder();
  const byteLength = (s: string) => encoder.encode(s).length;

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${byteLength(fullStream)} >>\nstream\n${fullStream}endstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  objects.forEach((obj) => {
    offsets.push(byteLength(pdf));
    pdf += obj;
  });

  const xrefOffset = byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    const padded = String(offsets[i]).padStart(10, '0');
    pdf += `${padded} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([encoder.encode(pdf)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SunStride_1Page_Technical_Spec.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
