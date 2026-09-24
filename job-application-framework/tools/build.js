#!/usr/bin/env node
// Builds a branded resume and cover letter (.docx) from one content JSON file.
// Usage: node build.js <content.json> <outDir>
// See ../templates/content.example.json for the schema.

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, TabStopType, LevelFormat,
} = require("docx");

// Brand tokens (Kristen_Resume_Brand_Style_Guide.md)
const T = {
  headFont: "Aptos Display",
  bodyFont: "Aptos",
  navy: "0A2F41",
  deepGreen: "3A7C22",
  brightGreen: "4EA72E",
  body: "1F2A30",
  muted: "5B6B73",
  tableHeadFill: "F5F7F9",
  tableBorder: "CFD8DC",
  nameSize: 72, // half-points: 36pt
  subHeadSize: 36, // 18pt
  bodySize: 20, // 10pt
  smallSize: 18, // 9pt
};
const PAGE_WIDTH_DXA = 12240 - 2 * 1440; // US Letter, 1" margins

const run = (text, o = {}) =>
  new TextRun({ text, font: o.font || T.bodyFont, size: o.size || T.bodySize, color: o.color || T.body, bold: o.bold, italics: o.italics });

const divider = () =>
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: T.navy, space: 1 } },
    spacing: { after: 120 },
  });

const sectionHeading = (text) =>
  new Paragraph({
    spacing: { before: 120, after: 40 },
    children: [run(text, { font: T.headFont, size: T.subHeadSize, color: T.deepGreen })],
  });

// Bold lead-in label + colon + regular sentence
const labeledBullet = ([label, text]) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 30 },
    children: !label ? [run(text)] : text ? [run(`${label}: `, { bold: true }), run(text)] : [run(label, { bold: true })],
  });

const header = (c, compact = false) => [
  new Paragraph({ children: [run(c.name, { font: T.headFont, size: compact ? 48 : T.nameSize, color: T.navy })] }),
  new Paragraph({ spacing: { after: 40 }, children: [run(c.headline, { font: T.headFont, size: 24, color: T.navy, bold: true })] }),
  ...(c.tagline && !compact ? [new Paragraph({ spacing: { after: 40 }, children: [run(c.tagline, { color: T.brightGreen, italics: true })] })] : []),
  new Paragraph({ children: [run(c.contact.join("  •  "), { size: T.smallSize, color: T.muted })] }),
  divider(),
];

const cellBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: T.tableBorder },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: T.tableBorder },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function matchTable(headers, rows) {
  const widths = [Math.round(PAGE_WIDTH_DXA * 0.3), PAGE_WIDTH_DXA - Math.round(PAGE_WIDTH_DXA * 0.3)];
  const cell = (text, i, isHead) =>
    new TableCell({
      borders: cellBorders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: isHead ? { fill: T.tableHeadFill, type: ShadingType.CLEAR, color: "auto" } : undefined,
      margins: { top: 40, bottom: 40, left: 100, right: 100 },
      children: [new Paragraph({ children: [run(text, { bold: isHead || i === 0, size: T.smallSize, color: i === 0 && !isHead ? T.navy : T.body })] })],
    });
  return new Table({
    width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, i, true)) }),
      ...rows.map((r) => new TableRow({ children: r.map((t, i) => cell(t, i, false)) })),
    ],
  });
}

function role(r) {
  return [
    new Paragraph({
      spacing: { before: 100 },
      tabStops: [{ type: TabStopType.RIGHT, position: PAGE_WIDTH_DXA }],
      children: [run(r.title, { bold: true, color: T.navy, size: 22 }), run(`\t${r.dates}`, { bold: true, color: T.navy, size: T.smallSize })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [run(r.company, { bold: true }), ...(r.context ? [run(`  |  ${r.context}`, { italics: true, color: T.muted })] : [])],
    }),
    ...r.bullets.map(labeledBullet),
  ];
}

const numbering = {
  config: [{
    reference: "bullets",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 360, hanging: 240 } }, run: { color: T.deepGreen } } }],
  }],
};
const pageProps = { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } };
const docStyles = { default: { document: { run: { font: T.bodyFont, size: T.bodySize, color: T.body } } } };

function buildResume(c) {
  const r = c.resume;
  const children = [...header(c.candidate)];
  children.push(sectionHeading("Summary"), new Paragraph({ spacing: { after: 80 }, children: [run(r.summary)] }));
  if (r.matchTable) {
    children.push(sectionHeading(r.matchTable.title || "Where I Match the Role"), matchTable(r.matchTable.headers, r.matchTable.rows));
  }
  children.push(sectionHeading("Experience"));
  r.experience.forEach((e) => children.push(...role(e)));
  if (r.earlier && r.earlier.length) {
    children.push(sectionHeading("Earlier Career"));
    r.earlier.forEach((l) => children.push(labeledBullet(l)));
  }
  children.push(sectionHeading("Certifications & Education"));
  (r.credentials || []).forEach((l) => children.push(labeledBullet(l)));
  return new Document({ styles: docStyles, numbering, sections: [{ properties: pageProps, children }] });
}

function buildCoverLetter(c) {
  const cl = c.coverLetter;
  const children = [...header(c.candidate, true)];
  const p = (kids, after = 120) => new Paragraph({ spacing: { after }, children: kids });
  children.push(p([run(cl.date)], 200));
  cl.recipient.forEach((l, i) => children.push(p([run(l, { bold: i === cl.recipient.length - 1 })], i === cl.recipient.length - 1 ? 200 : 0)));
  children.push(p([run(cl.salutation, { bold: true })]));
  cl.paragraphs.forEach((para) =>
    children.push(typeof para === "string" ? p([run(para)]) : p([run(`${para.label}: `, { bold: true, color: T.deepGreen }), run(para.text)]))
  );
  children.push(p([run(cl.closing)], 40), p([run(c.candidate.name, { bold: true, color: T.navy })]));
  return new Document({ styles: docStyles, numbering, sections: [{ properties: pageProps, children }] });
}

async function main() {
  const [contentPath, outDir] = process.argv.slice(2);
  if (!contentPath || !outDir) {
    console.error("Usage: node build.js <content.json> <outDir>");
    process.exit(1);
  }
  const c = JSON.parse(fs.readFileSync(contentPath, "utf8"));
  fs.mkdirSync(outDir, { recursive: true });
  const base = c.fileBase;
  const outputs = [[`${base}_Resume.docx`, buildResume(c)]];
  if (c.coverLetter) outputs.push([`${base}_Cover_Letter.docx`, buildCoverLetter(c)]);
  for (const [name, doc] of outputs) {
    fs.writeFileSync(path.join(outDir, name), await Packer.toBuffer(doc));
    console.log(path.join(outDir, name));
  }
}

main();
