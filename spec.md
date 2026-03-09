# VFL Betting Predictor

## Current State
New project. No existing backend or frontend code.

## Requested Changes (Diff)

### Add
- VFL Premier League score prediction app
- 20 Premier League teams with stats extracted from screenshots (match day 4 & 5 results + league table standings)
- Team selection UI: teams displayed in pairs (2 per row) for easy selection of Home vs Away matchup
- Score prediction engine that uses team stats (league position, goals scored, goals conceded, wins, draws, losses, goal difference) to weight random score generation intelligently
- Prediction result display showing predicted home score vs away score with reasoning
- Saved predictions store: user can save any generated prediction with a label/note
- Saved predictions list: view and delete saved predictions
- Input to enter a match label/note before saving

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan

### Backend
- Store team stats: name, position, played, wins, draws, losses, goalsFor, goalsAgainst, goalDiff, points
- Seed 20 Premier League teams with data from screenshots
- API: getTeams() -> list of all teams with stats
- API: saveprediction(homeTeam, awayTeam, homeScore, awayScore, note, timestamp) -> ID
- API: getPredictions() -> list of all saved predictions
- API: deletePrediction(id) -> bool

### Frontend
- Page 1: Team Selector
  - Header with app title
  - Two-step selection: first pick Home team (teams in 2-column grid for easy tap), then pick Away team
  - Selected matchup shown prominently
  - "Generate Prediction" button
- Page 2: Prediction Result
  - Shows home vs away team
  - Animated score reveal
  - Algorithm reasoning displayed (form, attack strength, defense strength)
  - Save prediction button with note input
- Page 3: Saved Predictions
  - List of all saved predictions with score, teams, note, date
  - Delete option per prediction

### Score Algorithm Logic
- Base expected goals calculated from team's attack rating (goals scored / games played)
- Defense modifier applied (goals conceded / games played) -- higher conceded = opponent scores more
- Position bonus: top-half teams get slight upward weight, bottom-half get slight downward weight
- Home advantage: home team gets +0.2 expected goals
- Final scores generated using weighted random from expected goals (Poisson-like distribution, capped at 6)
- Scores tend to reflect realistic football results (0-0 to 4-3 range)
