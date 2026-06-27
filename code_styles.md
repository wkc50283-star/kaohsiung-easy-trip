# code_styles.md

## Purpose

This file records the project style and change rules for the Kaohsiung no-car travel assistant.

The goal is to keep the site stable, readable, mobile-friendly, and protected from unnecessary changes.

## Project Identity

This project is a Kaohsiung no-car independent travel assistant.

It helps travelers plan how to visit Kaohsiung by public transportation, walking, ferries, rail, metro, light rail, buses, YouBike, and practical local reminders.

This is not a generic tourism brochure.
This is not a parking guide.
This is not a car-travel planner.

## Main Language

Use Traditional Chinese as the main language.
Use clear Taiwan-style wording.

Preferred tone:

- Direct
- Practical
- Easy to understand
- Friendly but not exaggerated
- Useful on a phone while traveling

Avoid:

- Long marketing copy
- Empty slogans
- Overly poetic travel writing
- Overclaiming certainty
- Making one route sound like the only correct route

## UI Style

The UI should feel like a sunny Kaohsiung harbor city.

Preferred feeling:

- Clean
- Warm
- Bright
- Mobile-first
- Clear hierarchy
- Easy for ordinary travelers to understand quickly

Rules:

- Do not add decoration that does not help the travel flow.
- Buttons should be obvious and easy to tap on mobile.
- Text should be readable on iPhone.
- Avoid cramped dense layouts.
- Do not make the page feel dead or overly static.

## Homepage Structure

The confirmed homepage order should be protected unless the user explicitly approves a change.

1. Hero attraction area
2. Departure point selection
3. Days / travel style selection
4. Recommendation generation
5. Warning / avoid-mistake reminders
6. Transportation method explanation
7. Accommodation base guidance
8. Nearby food and drink
9. Safe-route itinerary
10. Rainy day / hot day / local play options
11. Real traveler reminders
12. Multi-language entry
13. Bottom CTA

Do not reorder this flow during small tasks.
Do not replace it with a generic landing-page layout.
Do not remove sections without explicit approval.
Do not add new major sections during a small fix.

## Route Card Rules

Route cards in the first version should focus on:

- Transportation method
- Travel order
- Route logic
- Practical warning

Do not write travel times in route cards unless the user later approves a rule change.

The Hero example route from Zuoying to Cijin is only an example route.
It must not be written as a fixed answer or the only recommended route.

## Multi-Language Rules

Priority languages:

- Traditional Chinese
- English
- Japanese
- Korean
- Simplified Chinese

Future Southeast Asian language support may be added later, but do not add new language systems unless explicitly approved.

First version priority is Traditional Chinese.
Other languages can start with interface and core-page translation before full content depth.

## Development Style

Use minimal changes.

When changing code:

- Change only the necessary file.
- Change only the necessary block.
- Keep existing naming.
- Keep existing structure.
- Keep existing style unless the user asks otherwise.
- Do not refactor for convenience.
- Do not format unrelated code.
- Do not move files unless required and approved.
- Do not add dependencies unless required and approved.
- Do not change APIs unless required and approved.
- Do not change working behavior outside the requested scope.

If the task can be solved with one small edit, do one small edit.

## Review Before Changes

Before implementation, check:

- Is the task clear?
- Is the scope too broad?
- Could unrelated files be changed by mistake?
- Are frozen sections involved?
- Are there known constraints that must be protected?
- Should the task be read-only first?
- What is the smallest safe change?

For new features, new pages, content expansion, data cleanup, or project startup, begin with read-only onboarding.

## Do Not Mix Projects

Do not mix this project with the Kaohsiung parking guide project.

The parking guide is about finding parking near popular places.
This project is about traveling in Kaohsiung without driving.

They are different products, different users, different flows, and different priorities.

## Final Rule

When in doubt, stop and ask for review.

Do not guess.
Do not overbuild.
Do not redesign.
Do not touch frozen work.
