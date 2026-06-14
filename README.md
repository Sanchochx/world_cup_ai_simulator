# FIFA World Cup 2026 Simulator

An interactive tournament simulator for the 2026 FIFA World Cup, featuring all 48 teams across 12 groups, a full knockout bracket, and AI-powered match analysis.

## Features

- **Group Stage** — Enter scores for all group fixtures; standings update automatically with points, goal difference, and tiebreakers
- **Best Third Selection** — Automatically picks the 4 best third-place teams to advance per official FIFA rules
- **Knockout Bracket** — Full bracket from Round of 32 through the Final, with penalty shootout support
- **AI Match Analysis** — Get tactical breakdowns of any match powered by GPT-4o-mini
- **Persistent State** — Your simulation is saved to localStorage so you can pick up where you left off
- **Reset** — Start the tournament over at any time

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) — global state with persistence
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Recharts](https://recharts.org/) — charts
- [OpenAI API](https://platform.openai.com/) — streaming match analysis

## Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd worl_cup_2026_simulator

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then edit .env.local and add your OpenAI API key
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Group Stage** — Click any group on the home page, then enter scores for each match. The standings table updates in real time.
2. **Advance to Knockout** — Once all group matches have scores, go to the Bracket page and click "Populate Bracket" to seed the Round of 32.
3. **Knockout Stage** — Enter scores match by match. Winners advance automatically. For draws, select the penalty winner.
4. **AI Analysis** — On any match page, click "Analyze" to get a tactical breakdown of the matchup.
5. **Reset** — Use the reset button to clear all scores and start over.

## Project Structure

```
src/
├── app/
│   ├── api/analyze/        # Streaming AI analysis endpoint
│   ├── bracket/            # Knockout bracket page
│   ├── groups/[id]/        # Group detail page
│   └── match/[id]/analysis/# Match analysis page
├── components/             # UI components (GroupCard, BracketView, ScoreInput, ...)
├── data/                   # Static data (teams, groups, bracket seeding)
├── lib/                    # Simulator logic (table computation, tiebreakers)
└── store/                  # Zustand store
```

## License

MIT
