/**
 * Generates assets/EAK-Prospectus-2027-28.pdf from src/js/data.js, so the downloadable
 * prospectus can never drift from the numbers shown on the page.
 *
 *   npm run build:pdf
 */
import { readFileSync, createWriteStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import PDFDocument from 'pdfkit';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// src/js/data.js registers itself on window.EAK; give it a stand-in window.
const win = {};
new Function('window', readFileSync(join(root, 'src/js/data.js'), 'utf8'))(win);
const { school, programs, fees, dates, documents, faqs } = win.EAK.data;

const money = (n) => `Rs. ${n.toLocaleString('en-IN')}`;
const NAVY = '#0b1a45';
const BLUE = '#1d4ed8';
const AMBER = '#f59e0b';
const SLATE = '#334155';
const MUTED = '#64748b';

const doc = new PDFDocument({ size: 'A4', margins: { top: 56, bottom: 56, left: 56, right: 56 }, info: { Title: `${school.name} - Prospectus ${school.session}`, Author: school.name } });
doc.pipe(createWriteStream(join(root, 'assets/EAK-Prospectus-2027-28.pdf')));

const W = doc.page.width - 112;

function heading(text) {
  if (doc.y > 700) doc.addPage();
  doc.moveDown(1.2).font('Helvetica-Bold').fontSize(16).fillColor(NAVY).text(text);
  doc.moveTo(56, doc.y + 3).lineTo(96, doc.y + 3).lineWidth(3).strokeColor(AMBER).stroke();
  doc.moveDown(0.8).font('Helvetica').fontSize(10.5).fillColor(SLATE);
}

/* ---- Cover ---- */
doc.rect(0, 0, doc.page.width, 300).fill(NAVY);
doc.font('Helvetica-Bold').fontSize(11).fillColor(AMBER).text('ADMISSIONS OPEN  |  ACADEMIC SESSION ' + school.session.replace('–', '-'), 56, 90, { characterSpacing: 1.5 });
doc.font('Helvetica-Bold').fontSize(34).fillColor('#ffffff').text(school.name, 56, 120, { width: W });
doc.font('Helvetica').fontSize(16).fillColor('#cbd5e1').text('Nurturing Curious Minds into Future Leaders', 56, doc.y + 12, { width: W });
doc.font('Helvetica').fontSize(11).fillColor('#94a3b8').text('Prospectus for Grades 1 to 12', 56, doc.y + 26);

doc.fillColor(SLATE).font('Helvetica').fontSize(11).text(
  `This prospectus summarises academic programs, fees, key dates and documents for the ${school.session} session. For the latest details, visit our admissions page or call ${school.phoneDisplay}.`,
  56, 340, { width: W, lineGap: 3 }
);
doc.moveDown(1.5).font('Helvetica-Bold').fillColor(NAVY).text('Contact').font('Helvetica').fillColor(SLATE).text(`${school.address}\nHelpline: ${school.phoneDisplay}\nEmail: ${school.email}\nVisiting hours: ${school.hours}`);
doc.moveDown(2).fontSize(9).fillColor(MUTED).text('Sample prospectus generated for a demonstration admissions page. Figures are illustrative.');

/* ---- Programs ---- */
doc.addPage();
doc.font('Helvetica-Bold').fontSize(22).fillColor(NAVY).text('Academic Programs');
doc.moveDown(0.6);
programs.forEach((p) => {
  doc.font('Helvetica-Bold').fontSize(12.5).fillColor(BLUE).text(`${p.title}  (${p.grades}, ${p.ages})`);
  doc.font('Helvetica').fontSize(10.5).fillColor(SLATE).text(p.text, { lineGap: 2 });
  p.points.forEach((pt) => doc.text(`•  ${pt}`, { indent: 10 }));
  doc.moveDown(0.9);
});

/* ---- Fees ---- */
heading('Fee Structure (Session ' + school.session.replace('–', '-') + ')');
fees.forEach((f) => {
  doc.font('Helvetica-Bold').fillColor(NAVY).text(`${f.grades}  -  ${f.wing}`);
  doc.font('Helvetica').fillColor(SLATE).text(`Annual tuition: ${money(f.tuition)}    One-time admission fee: ${money(f.admission)}`);
  doc.fontSize(9.5).fillColor(MUTED).text(f.breakdown.map(([k, v]) => `${k} ${money(v)}`).join('   |   '));
  doc.fontSize(10.5).fillColor(SLATE).moveDown(0.6);
});
doc.fontSize(9.5).fillColor(MUTED).text('Fees can be paid in four quarterly instalments (April, July, October, January). Transport, uniform and meal plans are billed separately. Merit scholarships up to 50% for Grades 9-12.', { lineGap: 2 });

/* ---- Dates ---- */
heading('Important Dates');
const fmt = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
dates.forEach((d) => {
  const when = d.end ? `${fmt(d.start)} to ${fmt(d.end)}` : fmt(d.start);
  doc.font('Helvetica-Bold').fillColor(SLATE).text(when, { continued: true }).font('Helvetica').text(`   ${d.label}`);
});

/* ---- Documents ---- */
heading('Required Documents');
documents.forEach((d) => doc.font('Helvetica-Bold').text(`[ ]  ${d.title}: `, { continued: true }).font('Helvetica').text(d.text));

/* ---- FAQ ---- */
heading('Frequently Asked Questions');
faqs.slice(0, 4).forEach((f) => {
  doc.font('Helvetica-Bold').fillColor(NAVY).text(f.q);
  doc.font('Helvetica').fillColor(SLATE).text(f.a, { lineGap: 2 }).moveDown(0.6);
});

doc.end();
console.log('Wrote assets/EAK-Prospectus-2027-28.pdf');
