# IPL Analyzer — Frontend

A React dashboard for exploring Indian Premier League cricket data and predictions. It connects to the companion FastAPI backend and presents team statistics, head-to-head comparisons, player/season analysis, and win-probability predictions.

## Features

- Team statistics and venue data
- Head-to-head comparisons
- Win-probability prediction interface
- Player statistics and season-by-season views
- Season analysis dashboard

## Stack

React, Vite, Tailwind CSS, Axios, and Recharts.

## Run locally

Prerequisites: Node.js 22 LTS (Vite 8 requires a modern Node.js release) and npm.

```bash
npm ci
npm run dev
```

Vite prints the local development URL. Create a production build with `npm run build` and preview it using `npm run preview`.

## Backend connection

The frontend currently calls the deployed API at:

`https://ipl-analyzer-backend.onrender.com`

See `src/api.js` for the API client. The companion backend repository is [ipl-analyzer-backend](https://github.com/surendaran45/ipl-analyzer-backend). If you run the backend locally or deploy it to another host, update the API base URL in one place rather than duplicating endpoint strings across components.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## CI

GitHub Actions runs `npm ci`, ESLint, and a production build on pushes to `main` and this improvement branch, and on pull requests targeting `main`.

## Data and prediction caveat

Win probabilities are model estimates based on the backend's training data and encoded input categories. They are not guarantees of match outcomes. Check the backend's supported teams, venues, seasons, and model limitations before interpreting a prediction.
