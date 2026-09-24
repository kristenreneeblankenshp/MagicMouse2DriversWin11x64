# Job Application Framework

A repeatable workflow for turning a pasted job description into a tailored application package:

1. **Fit assessment**: requirement-by-requirement gap analysis, plus honest interview and offer odds
2. **Tailored resume** (.docx + .pdf, branded)
3. **Cover letter** (.docx + .pdf, branded)
4. **LinkedIn outreach**: connection note (≤300 chars), InMail, and a hiring-manager variant
5. **Work examples & narratives**: STAR stories mapped to the job description, each linked to its source file
6. **Confirm-before-sending checklist** and a tracker row

> **Privacy:** this repo is public. Personal content (resume text, contact details, client names, fit notes) belongs in `applications/` or `private/`, which are git-ignored, or in your Drive. Only the reusable framework is committed.

## How to re-run for a new role

Paste this into a Claude Code session that has Google Drive and Gmail connected:

```
Run the job application framework (job-application-framework/PROMPT.md) for this role:
<paste job description or link>
```

Claude follows [`PROMPT.md`](PROMPT.md) end to end. If the `job-application-package` skill is installed, it covers the same steps.

## Layout

```
job-application-framework/
├── README.md                      # this file
├── PROMPT.md                      # the step-by-step workflow Claude follows
├── templates/
│   ├── content.example.json       # schema for one application's resume + cover letter
│   └── work-examples.template.md  # structure for the narratives / fit brief
├── tools/
│   ├── build.js                   # content.json → branded Resume.docx + Cover_Letter.docx
│   ├── render.py                  # .docx → .pdf + PNG page previews (visual check)
│   └── package.json
└── applications/                  # git-ignored: one folder per role
```

## Building documents by hand

```bash
cd job-application-framework/tools
npm install                                   # installs docx
pip install pymupdf                           # PDF previews
node build.js ../applications/<role>/content.json ../applications/<role>/out
python3 render.py ../applications/<role>/out  # needs LibreOffice Writer (soffice)
```

In a fresh cloud container, you may first need `apt-get install -y libreoffice-writer fonts-crosextra-carlito`. Alias Aptos to Carlito in fontconfig so the page-count previews are close to what Word shows.

**Brand tokens** (in `build.js`): Aptos Display headings and Aptos body. Navy `#0A2F41` for the name, title and dividers. Deep green `#3A7C22` for section headings. Bright green `#4EA72E` for the tagline. Bullets are a bold lead-in label, a colon, then a regular sentence. Tables use a `#F5F7F9` header fill, `#CFD8DC` horizontal rules, and no vertical rules. US Letter with 1" margins.

**Targets:** the resume should fit 2 pages and the cover letter 1 page. Check the PNG previews in `out/preview/` before sending.
