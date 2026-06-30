'use client';

import { useState, useRef } from 'react';
import { useWorldCupStore } from '@/store/worldcupStore';
import { teams } from '@/data/teams';
import FlagImage from '@/components/FlagImage';

const ROUND_LABEL: Record<string, string> = {
  R32:  'Round of 32',
  R16:  'Round of 16',
  QF:   'Quarter-Finals',
  SF:   'Semi-Finals',
  F:    'World Cup Final',
  '3rd':'Third-Place Match',
};

function WinProbBar({ home, draw, away, homeName, awayName }: {
  home: number; draw: number; away: number; homeName: string; awayName: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs" style={{ color: '#6B7280' }}>
        <span>{homeName}</span>
        <span>Draw</span>
        <span>{awayName}</span>
      </div>
      <div className="flex rounded-full overflow-hidden h-6 text-xs font-bold">
        <div className="flex items-center justify-center transition-all" style={{ width: `${home}%`, backgroundColor: '#16a34a', color: '#fff' }}>
          {home > 10 ? `${home}%` : ''}
        </div>
        <div className="flex items-center justify-center transition-all" style={{ width: `${draw}%`, backgroundColor: '#ca8a04', color: '#fff' }}>
          {draw > 10 ? `${draw}%` : ''}
        </div>
        <div className="flex items-center justify-center transition-all" style={{ width: `${away}%`, backgroundColor: '#dc2626', color: '#fff' }}>
          {away > 10 ? `${away}%` : ''}
        </div>
      </div>
      <div className="flex justify-between text-xs font-bold">
        <span style={{ color: '#16a34a' }}>{home}%</span>
        <span style={{ color: '#ca8a04' }}>{draw}%</span>
        <span style={{ color: '#dc2626' }}>{away}%</span>
      </div>
    </div>
  );
}


function extractProbabilities(text: string): { home: number; draw: number; away: number } | null {
  const patterns = [
    /(\d+)%[^%]*?draw[^%]*?(\d+)%[^%]*?(\d+)%/i,
    /(\d+)%.*?(\d+)%.*?(\d+)%/,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) {
      const vals = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
      if (vals.every((v) => !isNaN(v)) && Math.abs(vals.reduce((a, b) => a + b, 0) - 100) <= 5) {
        return { home: vals[0], draw: vals[1], away: vals[2] };
      }
    }
  }
  return null;
}


export default function BracketAnalysisPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const bracket = useWorldCupStore((s) => s.bracket);
  const hasHydrated = useWorldCupStore((s) => s._hasHydrated);
  const match = bracket.find((m) => m.id === id) ?? null;

  if (!hasHydrated) return null;

  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [probs, setProbs] = useState<{ home: number; draw: number; away: number } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  if (!match || !match.homeTeam || !match.awayTeam) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center" style={{ color: '#6B7280' }}>
        Match not found or teams not yet determined.
      </div>
    );
  }

  const homeTeam = teams[match.homeTeam];
  const awayTeam = teams[match.awayTeam];
  const roundLabel = ROUND_LABEL[match.round] ?? match.round;

  const runAnalysis = async () => {
    setLoading(true);
    setAnalysis('');
    setError('');
    setProbs(null);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const prompt = `Analyze the match between ${homeTeam.name} vs ${awayTeam.name} at the 2026 FIFA World Cup.

Context:
${homeTeam.name} — FIFA Rank: #${homeTeam.fifaRank}, Confederation: ${homeTeam.confederation}, Recent form (Win%): ${homeTeam.form}%, Goals scored avg: ${homeTeam.goalsScored}, Goals conceded avg: ${homeTeam.goalsConceded}, Possession avg: ${homeTeam.possession}%, Pass accuracy: ${homeTeam.passAccuracy}%
${awayTeam.name} — FIFA Rank: #${awayTeam.fifaRank}, Confederation: ${awayTeam.confederation}, Recent form (Win%): ${awayTeam.form}%, Goals scored avg: ${awayTeam.goalsScored}, Goals conceded avg: ${awayTeam.goalsConceded}, Possession avg: ${awayTeam.possession}%, Pass accuracy: ${awayTeam.passAccuracy}%
Stage: ${roundLabel} — 2026 FIFA World Cup Knockout Stage

Provide exactly these sections:

## Tactical Preview
3–4 sentences on likely formations and strategies.

## Key Player Matchups
2–3 specific individual battles to watch.

## Statistical Edge
Which team holds the statistical advantage and why.

## Match Prediction
Win probability: ${homeTeam.name} X% | Draw Y% | ${awayTeam.name} Z% (must sum to 100%)

## Predicted Score
Most likely scoreline (format: X–X)

## Confidence Level
Low/Medium/High — with one sentence of reasoning.

Be bold, specific, and data-driven.`;

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'API error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setAnalysis(fullText);
      }

      setProbs(extractProbabilities(fullText));
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header matchup */}
      <div className="rounded-2xl border mb-8 overflow-hidden" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
        <div className="grid grid-cols-3 gap-4 p-6">
          {/* Home team */}
          <div className="text-center space-y-2">
            <FlagImage code={homeTeam.flag} size={80} className="w-20 h-16 mx-auto" />
            <h2 className="font-display text-xl font-bold" style={{ color: '#F9FAFB' }}>{homeTeam.name}</h2>
            <p className="text-xs" style={{ color: '#6B7280' }}>{homeTeam.confederation}</p>
            <div className="text-sm font-bold" style={{ color: '#00FF85' }}>#{homeTeam.fifaRank} FIFA</div>
          </div>

          {/* VS / Score */}
          <div className="flex flex-col items-center justify-center">
            {match.homeGoals !== null && match.awayGoals !== null ? (
              <div className="font-display text-4xl font-bold" style={{ color: '#F9FAFB' }}>
                {match.homeGoals} <span style={{ color: '#4B5563' }}>–</span> {match.awayGoals}
              </div>
            ) : (
              <div className="font-display text-4xl font-bold" style={{ color: '#1F2937' }}>VS</div>
            )}
            <div className="text-xs mt-2 text-center" style={{ color: '#6B7280' }}>
              {roundLabel} · 2026 FIFA World Cup
            </div>
          </div>

          {/* Away team */}
          <div className="text-center space-y-2">
            <FlagImage code={awayTeam.flag} size={80} className="w-20 h-16 mx-auto" />
            <h2 className="font-display text-xl font-bold" style={{ color: '#F9FAFB' }}>{awayTeam.name}</h2>
            <p className="text-xs" style={{ color: '#6B7280' }}>{awayTeam.confederation}</p>
            <div className="text-sm font-bold" style={{ color: '#00FF85' }}>#{awayTeam.fifaRank} FIFA</div>
          </div>
        </div>
      </div>

      {/* Stats Comparison */}
      <div className="rounded-2xl border mb-8 p-6" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
        <h3 className="font-display text-lg font-bold mb-4" style={{ color: '#F9FAFB' }}>Stats Comparison</h3>
        <div className="flex justify-between text-xs font-bold mb-3 px-2">
          <span style={{ color: '#00FF85' }}>{homeTeam.name}</span>
          <span style={{ color: '#FFD700' }}>{awayTeam.name}</span>
        </div>
        <div className="space-y-3 text-sm">
          {[
            { label: 'FIFA Rank', home: `#${homeTeam.fifaRank}`, away: `#${awayTeam.fifaRank}`, better: homeTeam.fifaRank < awayTeam.fifaRank ? 'home' : 'away' },
            { label: 'Form (Win%)', home: `${homeTeam.form}%`, away: `${awayTeam.form}%`, better: homeTeam.form > awayTeam.form ? 'home' : 'away' },
            { label: 'Goals Scored', home: homeTeam.goalsScored.toFixed(1), away: awayTeam.goalsScored.toFixed(1), better: homeTeam.goalsScored > awayTeam.goalsScored ? 'home' : 'away' },
            { label: 'Goals Conceded', home: homeTeam.goalsConceded.toFixed(1), away: awayTeam.goalsConceded.toFixed(1), better: homeTeam.goalsConceded < awayTeam.goalsConceded ? 'home' : 'away' },
            { label: 'Possession', home: `${homeTeam.possession}%`, away: `${awayTeam.possession}%`, better: homeTeam.possession > awayTeam.possession ? 'home' : 'away' },
            { label: 'Pass Accuracy', home: `${homeTeam.passAccuracy}%`, away: `${awayTeam.passAccuracy}%`, better: homeTeam.passAccuracy > awayTeam.passAccuracy ? 'home' : 'away' },
          ].map(({ label, home, away, better }) => (
            <div key={label} className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg" style={{ backgroundColor: '#0B1120' }}>
              <span className="w-20 text-right font-bold" style={{ color: better === 'home' ? '#00FF85' : '#F9FAFB' }}>{home}</span>
              <span className="text-center text-xs flex-1" style={{ color: '#6B7280' }}>{label}</span>
              <span className="w-20 text-left font-bold" style={{ color: better === 'away' ? '#FFD700' : '#F9FAFB' }}>{away}</span>
            </div>
          ))}
        </div>
      </div>

      {probs && (
        <div className="rounded-2xl border mb-8 p-6" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
          <h3 className="font-display text-lg font-bold mb-4" style={{ color: '#F9FAFB' }}>Win Probability</h3>
          <WinProbBar home={probs.home} draw={probs.draw} away={probs.away} homeName={homeTeam.name} awayName={awayTeam.name} />
        </div>
      )}

      {/* AI Analysis */}
      <div className="rounded-2xl border p-6" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold" style={{ color: '#F9FAFB' }}>
            AI Analyst Report
          </h3>
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-60"
            style={{ backgroundColor: '#00FF85', color: '#0B1120' }}
          >
            {loading ? 'Analyzing...' : analysis ? 'Re-analyze' : 'Run AI Analysis'}
          </button>
        </div>

        {!analysis && !loading && !error && (
          <div className="py-12 text-center" style={{ color: '#6B7280' }}>
            <div className="text-4xl mb-3">🔍</div>
            <p>Click &quot;Run AI Analysis&quot; to get a tactical breakdown powered by AI</p>
          </div>
        )}

        {loading && !analysis && (
          <div className="space-y-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 rounded" style={{ backgroundColor: '#1F2937', width: `${70 + (i * 7) % 30}%` }}></div>
            ))}
          </div>
        )}

        {error && (
          <div className="py-6 text-center rounded-lg" style={{ backgroundColor: '#1F0000', color: '#f87171' }}>
            <p className="font-medium">Analysis unavailable</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="prose prose-invert max-w-none">
            <div
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: '#F9FAFB' }}
              dangerouslySetInnerHTML={{
                __html: analysis
                  .replace(/## (.+)/g, '<h3 class="font-display text-base font-bold mt-6 mb-2" style="color:#00FF85">$1</h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#FFD700">$1</strong>')
                  .replace(/\n/g, '<br/>')
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
