#!/usr/bin/env python3
"""Convert every .docx in a folder to PDF (LibreOffice) and render page previews (PyMuPDF).

Usage: python3 render.py <outDir>
Writes <name>.pdf next to each .docx and <name>_p<N>.png previews into <outDir>/preview/.
"""
import pathlib
import subprocess
import sys

import pymupdf


def main(out_dir: str) -> None:
    out = pathlib.Path(out_dir)
    preview = out / "preview"
    preview.mkdir(exist_ok=True)
    for docx in sorted(out.glob("*.docx")):
        subprocess.run(
            ["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(out), str(docx)],
            check=True, capture_output=True,
        )
        pdf = docx.with_suffix(".pdf")
        with pymupdf.open(pdf) as doc:
            print(f"{pdf.name}: {doc.page_count} page(s)")
            for i, page in enumerate(doc, start=1):
                page.get_pixmap(dpi=100).save(preview / f"{docx.stem}_p{i}.png")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage: python3 render.py <outDir>")
    main(sys.argv[1])
