# CertPrep

A reusable, **offline-first** mobile study app for certification exams. Content is *data*, not
code — each certification is a "content pack" that plugs into the same app. The first pack is
**AWS Solutions Architect – Associate (SAA-C03)**.

Built with Expo + React Native + TypeScript. No account, no internet needed to study.

---

## Preview it on your phone (2 minutes, no build required)

1. Install the **Expo Go** app from the Google Play Store on your Android phone.
2. On this PC, in a terminal:
   ```
   cd "D:\AWS SAA03 learning\certprep"
   npm start
   ```
3. A **QR code** appears in the terminal. Open **Expo Go** → *Scan QR code* → point it at the screen.
   (Phone and PC must be on the same Wi-Fi.)
4. The app loads live. Edit anything and it hot-reloads on the phone.

> No Android Studio / Java needed for this — Expo Go runs the app for you.

---

## What's inside (v1 features)

- **Practice quizzes** — mixed, per-domain, per-topic, or a 20-question mock. Questions are
  weighted toward what you haven't seen or got wrong (active recall + spaced resurfacing).
- **Instant explanations** on every question.
- **Weak-spot engine** — the app tracks accuracy per topic, flags your weak areas, and links each
  one to a focused "learn this" study note.
- **Confusables** — side-by-side cards for the look-alike services the exam loves to trick you on
  (SG vs NACL, SQS vs SNS, Multi-AZ vs Read Replica, gp3 vs io2, S3 classes, …).
- **Progress dashboard** — readiness estimate on the 100–1000 scale, per-domain mastery, session
  history. All stored locally on the device.

## Content status

Content pack `aws-saa-c03` **v0.1.0**: 4 domains · 20 topics · **161 questions** · 10 confusables.
Generated and adversarially fact-checked by a multi-agent pipeline. 14/20 topics are fully
verified; 6 topics are first-pass drafts pending a re-verification run (see `docs` / ask Claude).

---

## How the content pipeline works (your workflow)

You **supply raw study material** (questions you go through, notes, screenshots, dumps). Claude:
1. extracts the patterns, the highest-ROI topics, and the real exam question style,
2. generates original, exam-realistic questions + "learn" notes into the content pack,
3. runs an adversarial correctness pass so answers stay accurate,
4. keeps reiterating as you add more material.

Drop new material into `../content-source/` (see its README) and tell Claude to process it.

## Project structure

```
certprep/
  App.tsx                       app root (providers + navigation)
  src/
    content/                    the knowledge base
      types.ts                  data model (Question, Topic, Domain, Comparison, ContentPack)
      packs/aws-saa-c03.*.ts    the SAA-C03 pack (data is auto-generated; comparisons hand-authored)
      repository.ts             query layer the UI reads through
    logic/                      mastery/weak-spots + quiz building
    store/                      Zustand state (progress persisted to device, quiz session transient)
    components/                 UI primitives + markdown renderer
    screens/                    Home, Practice, Quiz, Results, Progress, Learn, TopicDetail, Compare
    theme/                      light/dark design tokens
    navigation/                 tabs + stack
```

## Road to Google Play (later, when you're ready)

1. `npm install -g eas-cli` then `eas login` (free Expo account).
2. `eas build -p android --profile production` → Expo builds a signed **`.aab`** in the cloud
   (no Android Studio needed on Windows).
3. Create a Google Play Console developer account (one-time $25), then upload the `.aab` — or use
   `eas submit -p android` to upload automatically.

Claude will set up `eas.json`, the app icon/splash, and store listing assets when you decide to ship.
