// ============================================================
// EVENTS DATA — OPEN/CLOSED PRINCIPLE
// ============================================================
// To add a new event:
//   1. Copy one of the objects below and paste it at the top
//   2. Fill in the fields
//   3. Drop the event poster image in /src/assets/
//   4. Drop the questions .docx in /src/assets/questions/
//      (leave questionDoc as null if not yet released)
//   5. Save. Done.
//
// The rest of the website updates automatically.
// ============================================================

import religionImg   from '../assets/event-wk1-thu-religion.jpg';
import democracyImg  from '../assets/event-wk1-fri-democracy.jpg';
import happinessImg  from '../assets/event-wk2-thu-happiness.jpg';

export const events = [
  {
    id: 'wk1-thu-religion',
    week: 1,
    type: 'Discussion',                        // 'Discussion' | 'Collaborative Discussion' | 'Lecture'
    title: 'Is Religion A Scam?',
    date: '2025-06-05T17:00:00',              // ISO 8601 — questions auto-unlock on this date
    location: 'Morven Brown G3',
    building: 'University of New South Wales',
    image: religionImg,
    questionDoc: null,                         // e.g. 'wk1-thu-religion-questions.docx'
    instagramPost: null,                       // e.g. 'https://www.instagram.com/p/abc123'
  },
  {
    id: 'wk1-fri-democracy',
    week: 1,
    type: 'Collaborative Discussion',
    title: 'Is Democracy Suicide?',
    date: '2025-06-06T17:00:00',
    location: 'Quadrangle G053',
    building: 'University of New South Wales',
    image: democracyImg,
    questionDoc: null,
    instagramPost: null,
  },
  {
    id: 'wk2-thu-happiness',
    week: 2,
    type: 'Discussion',
    title: 'What Is Happiness?',
    date: '2025-06-12T17:00:00',
    location: 'Morven Brown G3',
    building: 'University of New South Wales',
    image: happinessImg,
    questionDoc: null,
    instagramPost: null,
  },
];
