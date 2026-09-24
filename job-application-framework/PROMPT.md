# Application Package Workflow

Follow these steps in order for each job description the user pastes. Work in `applications/<company>-<role-slug>/` (git-ignored) or the session scratchpad. Never commit personal content to this public repo.

## 0. Ground rules
- **Source of truth for titles and dates:** the Drive sheet *"2024-2025 EMPLOYMENT HISTORY ADDRESS HISTORY FOR ONBOARDING NEW JOBS__PAST 10 YEARS"*, plus the per-employer *Role Summary* docs. If another document disagrees on a date or title, the sheet wins. Flag the disagreement to the user.
- **Metrics:** include a number only if a source file supports it, or if it's the user's own consistently stated figure. In the second case, list it in the confirm-before-sending checklist. Never invent scope, outcomes, team sizes, or certifications.
- **Known-unreliable sources (don't use them):** any "Comprehensive … Dossier," "Executive Value Proposition," "Sr Director Leveling Case," and AI-generated resumes with dates that conflict with the sheet (e.g., the "Anthropology" doc).
- **AI framing is era-specific:** Spaulding Ridge (2026) is Agentforce. Simplus/Infosys (2021–2024) is Einstein Copilot and Service Cloud AI. Personal AI tooling (Claude, Manus, Otter.ai) is fair to mention where files show it.

## 1. Understand the role
- Pull out: must-haves, nice-to-haves, the language the posting keeps repeating, location and in-office policy, and salary range.
- Judge fit only from the **full** job description, never from a title or alert snippet. Titles can hide a very different role (e.g., a "Finance Systems Director" that is really hands-on Python/DBT/Airflow engineering).
- If the posting site is blocked from the session, ask the user to save the job page to Drive (or paste it) and read it from there.
- Find the live req ID and apply link. Greenhouse is the most reliable for many tech companies. Aggregators help confirm a listing is still live. LinkedIn job pages can't be fetched.

## 2. Fit assessment (before building anything)
- Build a table of requirements with ✅ / 🟡 / ❌ and the evidence for each.
- Give honest interview and offer probabilities, and list the risks an interviewer will probe (tenure, gaps, location, domain).
- If the fit is poor, say so and **stop** unless the user explicitly wants to go ahead.
- If the role is below the user's level, use this reframe: bringing architecture-level thinking in now avoids needing a second hire as the company scales.
- Mention any better-fit roles at the same company (check Gmail job alerts), and label them "unverified" until their full descriptions have been read.
- When the user asks for several roles at once, build full packages only for the ones that pass this step. For the rest, deliver a one-page fit memo.

## 3. Source work examples
- **Drive:** role summaries, recent decks, proposals, ROMs, estimators and test documents. Search with `fullText contains` / `title contains` and `modifiedTime` filters. Get links for each example.
- **Gmail:** earlier threads with this company or recruiter (`search_threads` for the company name). Job alerts show other openings.
- Map each example to a job-description line using the STAR format, with its source link.

## 4. Resume (`content.json` → `tools/build.js`)
- Copy `templates/content.example.json` and fill it in.
- Include a "Where I Match the Role" table that maps the posting's language to evidence.
- Bullets start with a label that echoes the posting's language, followed by one factual sentence.
- Build, render, and look at every preview page. Trim until the resume fits 2 pages and the letter 1 page.

## 5. Cover letter
- Open with the company's own framing of the problem, then say why you've already solved it. Follow with 3–4 labeled paragraphs, each tied to a job-description theme. Name the biggest gap yourself, calmly and honestly. Close with location and logistics, and a clear next step.

## 6. LinkedIn
- A: recruiter connection note, 300 characters or fewer (count them).
- B: a longer InMail or follow-up.
- C: a hiring-manager variant, but only if a name can actually be found. **Never guess names.**

## 7. Deliver and track
- Deliver: the resume and cover letter (.docx + .pdf), `LinkedIn_Outreach.md`, and `Work_Examples_and_Narratives.md` (fit assessment, STAR stories, 90-day point of view, confirm-before-sending checklist, tracker row).
- Give the user the tracker row for the current `Kristen_Job_Search_Tracker_*` sheet.
- Save any new verified facts (new employer, contact, status change) back to the user's notes or memory.
