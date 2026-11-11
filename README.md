# Personal Portfolio Website

A single-page portfolio built as a bento-style grid, with a live Spotify listening card, an interactive mechanical keyboard build, and project details pulled from JSON data files.

**Live:** [brysonreyes.dev](https://brysonreyes.dev)

## Why this exists

I wanted a portfolio that shows a little bit about me rather than just a list of projects in a template. I don't typically focus on frontend development, so this site doubled as a way to learn more about React, Next.js, and Tailwind.

## Features

- **Live Spotify integration:** shows what I'm currently listening to in real time
- **Interactive keyboard build card:** renders my current keyboard layout with per-switch detail (stabs, keycaps, switches, springs, mods, sound profile), built as SVG rather than an image (in progress, typing test integration planned)
- **Currently Into:** currently reading/watching/building/learning, each paired with an all-time favorite in the same category, pulled from a JSON data file so it's easy to keep current
- **Projects section:** live status badges (Live / Completed / In Progress), links out to working demos, and a dedicated all-projects page with tech stack breakdowns per project
- **Bento grid layout:** desktop-first, planning to rebuild for better mobile experience
- **Not-live routing:** projects without a public demo route to a dedicated page instead of a dead link

## Stack

- **Next.js:** (App Router) routing and structure
- **Tailwind CSS:** styling
- **Spotify API:** live listening data
- **Vercel:** deployment, analytics, speed insights

## What I learned

This was my second project in the React/Next.js ecosystem. Coming from a background heavier in Python and backend/systems work (computer vision, cloud deployment), the biggest difference was thinking in components and state instead of scripts. Working with Tailwind also changed how I think about styling, it took some getting used to but I learned a lot about the efficiency and usefulness.

## Running locally

\`\`\`bash
git clone https://github.com/bryreyes/personal-site
cd personal-site
npm install
npm run dev
\`\`\`

Add a `.env.local` with Spotify API credentials (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN) to run the live listening card locally.

## Other projects

More of my work is at https://brysonreyes.dev/projects.