# Portfolio walkthrough — Clarity AI + Muse

Use this as a **rehearsal guide**, not a script to read word for word. You must understand and be able to demonstrate every feature you describe. Do not claim independent user research, deployment reliability, or AI-model work that you did not perform.

## 10-minute Clarity AI walkthrough

**0:00–1:00 — Context / problem**

"Clarity AI explores how students might verify an answer without constantly switching between their research source and the AI interface. The premise is a hypothesis based on the workflow I wanted to investigate—not a validated user complaint."

**1:00–2:20 — Design alternatives**

Show the three diagrams in `/projects/clarity-ai`: conversation-first, search-results-first, and answer-with-evidence. Explain the tradeoff: simplicity versus evidence visibility versus screen density. The diagrams are reconstructions of design alternatives and not historical screenshots of interviews or experiments.

**2:20–5:20 — Live demonstration**

Open `/lab/clarity-ai`. Paste a new source, ask a specific question, inspect the matching excerpt, read full source text, save a result and locate it in Saved answers. Explain the difference between source-search mode and optional Claude synthesis and why the UI must be explicit about that.

**5:20–7:10 — One decision in depth**

"I kept the evidence panel close to the answer because a list of citations below a long chat response can make verification easy to skip. It creates a responsive-design challenge, so small screens stack the evidence instead of squeezing three columns."

**7:10–8:10 — Engineering / AI disclosure**

Explain React state, server route, source ranking in `lib/clarity-engine.ts`, model-key boundary, and limitations. AI-assisted coding accelerated parts of implementation; the design still needs human validation. Don't claim the retrieval method ensures factual correctness.

**8:10–10:00 — What remains unverified**

Open `/study/clarity-ai`. Walk through one observation task and what evidence would make you change your mind. Admit there are no verified participant outcomes yet unless you've actually run them.

## 10-minute Muse walkthrough

**0:00–1:00 — Context:** Collecting inspiration isn't the same as developing a direction. That is the design premise, not a proven market finding.

**1:00–2:20 — Alternatives:** Browse-only feed, folders, and spatial canvas. Describe why the spatial editor makes visual relationships explicit, while adding interaction complexity.

**2:20–5:20 — Live demo:** Inspect image details, save two images to a new board, add a note, rearrange an item with pointer and keyboard, export PNG and JSON. If a feature fails, describe it as an issue; don't hide it.

**5:20–6:45 — Iteration:** Explain the readable Muse cover, the Discover → Boards → Studio onboarding, and keyboard movement affordances. These were self-critique changes, not user-tested outcomes.

**6:45–8:20 — Technical implementation:** Explain browser-local persistence, image resizing, canvas capture, responsive horizontal board scroll, and the lack of accounts or true multi-user collaboration.

**8:20–10:00 — Usability plan:** Show `/study/muse`; state which task you'd test first and what observation would lead to revising the design.

## Typical interviewer follow-ups

- Why did you choose this problem? How do you know it's real? (Separate hypotheses from research.)
- What other solutions did you consider, and why did you choose this one?
- Describe a design change made because of criticism. Whose feedback was it? (Self-critique vs actual participants.)
- What would you remove if given two weeks instead of two months?
- What feature has the highest risk of misleading someone? (Clarity: AI confidence / source support. Muse: browser-only persistence / misunderstood export.)
- What did Claude Code or AI actually contribute? What did you personally decide or validate?
- What would you measure after launch? Why those metrics? (No invented results.)

## Company alignment (not an endorsement or prediction)

- **Palantir:** discuss source traceability, exception states, real data boundaries, tradeoffs, and complex workflows.
- **Notion:** emphasize adaptable working surfaces, user comprehension, shortcuts, and design-system consistency.
- **Pinterest:** emphasize visual hierarchy, creative collection and curation, inspiration-to-action, and the Muse image-detail interaction.

The strongest interview isn't the one with the most impressive adjectives. It's the one where you can point at a screen, explain a difficult choice, and tell the truth about what you know and what is still a hypothesis.
