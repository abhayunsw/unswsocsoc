# Contributing to the Socratic Society UNSW Website

> **This guide is written for future exec members who may or may not have a coding background.**
> Everything content-related lives in two simple files. You don't need to touch anything else.

---

## Quick Overview

The website is built with React + Vite and deployed on Vercel.
All content lives in `/src/data/` — events, team members. That's it.

---

## How to Add a New Event

1. **Open** `src/data/events.js`

2. **Copy** one of the existing event objects and paste it at the top of the `events` array

3. **Fill in the fields:**

```js
{
  id: 'wk3-tue-justice',           // unique slug, no spaces (use hyphens)
  week: 3,                          // week number
  type: 'Discussion',               // 'Discussion' | 'Collaborative Discussion' | 'Lecture'
  title: 'Is Justice Real?',        // the topic question
  date: '2025-07-15T17:00:00',      // date + time in this format (24hr)
  location: 'Morven Brown G3',      // room/building shorthand
  building: 'University of New South Wales',
  image: justiceImg,                // see step 4
  questionDoc: null,                // see step 5 — leave null until you upload the doc
  instagramPost: null,              // paste Instagram URL after posting, e.g. 'https://www.instagram.com/p/abc123'
}
```

4. **Add the event poster image:**
   - Drop the `.jpg` file into `/src/assets/`
   - Name it clearly, e.g. `event-wk3-tue-justice.jpg`
   - At the top of `events.js`, add the import:
     ```js
     import justiceImg from '../assets/event-wk3-tue-justice.jpg';
     ```
   - Use `justiceImg` in the `image` field

5. **Add discussion questions (on the day of the event):**
   - Drop the `.docx` file into `/src/assets/questions/`
   - Name it clearly, e.g. `wk3-tue-justice-questions.docx`
   - Update `questionDoc` in the event object:
     ```js
     questionDoc: 'wk3-tue-justice-questions.docx',
     ```
   - The download button will appear automatically once the event date has passed

6. **Save the file.** Vercel will redeploy automatically in ~1 minute.

---

## How to Update the Team (New Term)

1. **Open** `src/data/team.js`

2. **Update the names and roles** directly in the array

3. **For photos:**
   - Drop headshots into `/src/assets/team/`
   - Name them e.g. `gabriel.jpg`
   - Import them at the top of `team.js`:
     ```js
     import gabrielPhoto from '../assets/team/gabriel.jpg';
     ```
   - Set `photo: gabrielPhoto` on the relevant team member

4. **Save.** Done.

---

## How to Deploy

The site is connected to Vercel. Every time you push to the `main` branch on GitHub,
Vercel automatically rebuilds and redeploys within ~1 minute. No manual steps needed.

To push changes:
```bash
git add .
git commit -m "Add Week 3 event"
git push
```

---

## Running Locally (for developers)

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## File Structure Reference

```
src/
  data/
    events.js       ← ADD NEW EVENTS HERE
    team.js         ← UPDATE TEAM HERE
  assets/
    *.jpg / *.png   ← Event poster images + logos
    questions/      ← Discussion question .docx files
    team/           ← Exec headshots (add when available)
  components/
    EventCard.jsx   ← Don't touch unless redesigning
    TeamCard.jsx    ← Don't touch unless redesigning
    Navbar.jsx      ← Don't touch unless redesigning
    Footer.jsx      ← Update Instagram/Facebook links if they change
  pages/
    Home.jsx        ← Landing page
    Events.jsx      ← Events listing
    About.jsx       ← About us + team
```

---

## Who built this

Website designed and built by **Abhay Sharma**, Digital Content Director 2025.
For questions, reach out to the current Digital Content Director.
