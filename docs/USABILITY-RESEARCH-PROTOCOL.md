# Clarity AI + Muse — moderated usability protocol

**Status:** study plan only. No participants or findings are represented here as completed.

## Why test

The portfolio already demonstrates working React interactions. Interviews become stronger when there is evidence of understanding real behavior, not simply the ability to ship attractive screens. We need to learn where an unfamiliar participant hesitates and which decisions should change.

## Recruiting participants

- **Clarity AI:** seek 4–6 current students who regularly work with written research sources. Use a mix of familiarity levels with AI tools.
- **Muse:** seek 4–6 people who have made a moodboard or assembled creative references. Ask about their normal workflow *before* showing the app.
- This is a suggested initial sample for formative testing, **not** a claim of statistical representativeness or a fixed requirement.
- Do not collect their names, addresses, email addresses, university IDs, photos, or private coursework in the study form. Use participant codes `P01`, `P02`, etc.
- Have a participant's permission before recording observations. Don't secretly record video or audio.

## Session format (about 20–25 minutes)

1. **Introduction — 2 minutes:** “I'm testing the design, not your ability. Please think aloud. There are no wrong answers. You can stop at any time.” State whether any notes or recordings will be collected.
2. **Context — 3 minutes:** “How do you do this task today?” Don't make promises about features the prototype doesn't have.
3. **Task-based observation — 12–15 minutes:** Read tasks from `/study/clarity-ai` or `/study/muse` verbatim. Do not tell participants where to click. Keep the deployed app open in a second tab.
4. **Debrief — 3–5 minutes:** Ask “What felt difficult?” “What felt natural?” and “What one thing would you change?”
5. **Document & export — 2 minutes:** Record each task as `completed independently`, `completed with help`, `could not complete`, or `not attempted`. Enter observable behavior and export CSV.

## Recording standards

- Separate **observation** (“Participant clicked Browse twice before noticing Boards”) from **interpretation** (“Boards might need higher visual prominence”).
- Exact quotes only if the participant actually said the words; never invent or paraphrase as a quotation.
- Record exceptions and abandoned tasks, not only successful ones.
- Keep each person's results as a single session; don't alter session data to improve a metric.
- No statistical significance or generalized claims from a few interviews.
- Store the exported CSV privately. No study data is uploaded by the tool.

## Synthesizing results after the sessions

After sessions are genuinely conducted, create a findings table in a **new** document:

| Issue | Observations (participant codes) | Severity | Candidate change | Retest task |
|---|---|---|---|---|
| *Blank* | | | | |

Choose a single iteration, implement it, and retest with at least a few participants if possible. If you publish task-success numbers, state both numerator and denominator and explain exactly which task and sample they cover (e.g., `3 of 5 participants completed Task 2 without facilitator help`). Never claim an improvement until you have a comparable before/after measurement.

## Where to run

- `/lab/clarity-ai` + `/study/clarity-ai`
- `/lab/muse` + `/study/muse`

The public study pages intentionally show **no stored participant results** to external visitors because sessions live only in the facilitator's browser. Update the case studies manually *after* reviewing and verifying the exported records.
