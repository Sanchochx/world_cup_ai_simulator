'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { BracketMatch, useWorldCupStore } from '@/store/worldcupStore';
import { teams } from '@/data/teams';
import { ROUND_OF_32, MATCH_SCHEDULE } from '@/data/bracket';
import FlagImage from './FlagImage';

// --- Layout constants (natural / unscaled) ---
const SLOT_H  = 100;           // height of one R32 slot
const TOTAL_H = SLOT_H * 8;   // 8 slots per side
const COL_W   = 158;           // round column width
const CONN_W  = 22;            // standard connector strip
const REST_W  = 34;            // wider connector for rest-day strips
const CENTER_W = 180;          // Final / 3rd-place column
const HEADER_H = 26;           // round label row height

// 2 regular connectors (R32→R16 each side) + 6 rest-day connectors
const NATURAL_W = 8 * COL_W + 2 * CONN_W + 6 * REST_W + CENTER_W;
const NATURAL_H = HEADER_H + TOTAL_H;

const LINE_COLOR  = '#4B5563';
const REST_COLOR  = '#374151';
const LINE_W      = 1.5;

// Round accent colours
const ROUND_ACCENT: Record<string, string> = {
  R32:  '#E8541A',
  R16:  '#3BBFBF',
  QF:   '#E8541A',
  SF:   '#3BBFBF',
  F:    '#E8541A',
  '3rd':'#C07C2A',
};

function formatDate(dateStr: string): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const parts = dateStr.split('-');
  return `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}`;
}

// ---------------------------------------------------------------------------
// SVG connector between two adjacent rounds
// ---------------------------------------------------------------------------
function RoundConnector({
  fromSlots,
  toSlots,
  fromSide,
  restDay,
}: {
  fromSlots: number;
  toSlots: number;
  fromSide: 'left' | 'right';
  restDay?: string;
}) {
  const w          = restDay ? REST_W : CONN_W;
  const fromSlotH  = TOTAL_H / fromSlots;
  const toSlotH    = TOTAL_H / toSlots;
  const groupSize  = fromSlots / toSlots;
  const midX       = w / 2;
  const lc         = restDay ? REST_COLOR : LINE_COLOR;
  const dash       = restDay ? '3,2' : undefined;
  const lines: React.ReactElement[] = [];

  for (let g = 0; g < toSlots; g++) {
    const toY      = g * toSlotH + toSlotH / 2;
    const topFromY = g * groupSize * fromSlotH + fromSlotH / 2;
    const botFromY = (g * groupSize + groupSize - 1) * fromSlotH + fromSlotH / 2;

    for (let k = 0; k < groupSize; k++) {
      const fromY = (g * groupSize + k) * fromSlotH + fromSlotH / 2;
      const x1 = fromSide === 'left' ? 0 : w;
      lines.push(
        <line key={`h${g}-${k}`} x1={x1} y1={fromY} x2={midX} y2={fromY}
          stroke={lc} strokeWidth={LINE_W} strokeDasharray={dash} />
      );
    }

    lines.push(
      <line key={`v${g}`} x1={midX} y1={topFromY} x2={midX} y2={botFromY}
        stroke={lc} strokeWidth={LINE_W} strokeDasharray={dash} />
    );

    const x2 = fromSide === 'left' ? w : 0;
    lines.push(
      <line key={`to${g}`} x1={midX} y1={toY} x2={x2} y2={toY}
        stroke={lc} strokeWidth={LINE_W} strokeDasharray={dash} />
    );
  }

  if (restDay) {
    lines.push(
      <text
        key="restlabel"
        x={midX}
        y={TOTAL_H / 2}
        fill="#F59E0B"
        fontSize={6}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90,${midX},${TOTAL_H / 2})`}
        style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
      >
        REST · {restDay}
      </text>
    );
  }

  return (
    <svg width={w} height={TOTAL_H}
      style={{ display: 'block', flexShrink: 0, marginTop: HEADER_H }}
    >
      {lines}
    </svg>
  );
}

// Horizontal connector between SF column and the Final column
function SFConnector({ restDay }: { restDay?: string }) {
  const w  = restDay ? REST_W : CONN_W;
  const y  = TOTAL_H / 2;
  const lc = restDay ? REST_COLOR : LINE_COLOR;
  const dash = restDay ? '3,2' : undefined;
  return (
    <svg width={w} height={TOTAL_H}
      style={{ display: 'block', flexShrink: 0, marginTop: HEADER_H }}
    >
      {restDay && (
        <text
          x={w / 2}
          y={TOTAL_H / 2}
          fill="#F59E0B"
          fontSize={6}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(-90,${w / 2},${TOTAL_H / 2})`}
          style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
        >
          REST · {restDay}
        </text>
      )}
      <line x1={0} y1={y} x2={w} y2={y}
        stroke={lc} strokeWidth={LINE_W} strokeDasharray={dash} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Match card
// ---------------------------------------------------------------------------
const CARD_H = 96;

function MatchCard({ match }: { match: BracketMatch }) {
  const setBracketScore  = useWorldCupStore((s) => s.setBracketScore);
  const setPenaltyWinner = useWorldCupStore((s) => s.setPenaltyWinner);
  const homeTeam = match.homeTeam ? teams[match.homeTeam] : null;
  const awayTeam = match.awayTeam ? teams[match.awayTeam] : null;

  const [homeVal, setHomeVal] = useState(match.homeGoals !== null ? String(match.homeGoals) : '');
  const [awayVal, setAwayVal] = useState(match.awayGoals !== null ? String(match.awayGoals) : '');

  useEffect(() => {
    setHomeVal(match.homeGoals !== null ? String(match.homeGoals) : '');
    setAwayVal(match.awayGoals !== null ? String(match.awayGoals) : '');
  }, [match.id, match.homeGoals, match.awayGoals]);

  const commit = (h: string, a: string) => {
    const hVal = h === '' ? null : parseInt(h);
    const aVal = a === '' ? null : parseInt(a);
    setBracketScore(
      match.id,
      hVal !== null && !isNaN(hVal) ? hVal : null,
      aVal !== null && !isNaN(aVal) ? aVal : null,
    );
  };

  const r32Idx  = match.round === 'R32' ? parseInt(match.id.split('-')[1]) - 1 : -1;
  const fixture = r32Idx >= 0 ? ROUND_OF_32[r32Idx] : null;
  const sched   = fixture
    ? { date: fixture.date, time: fixture.time }
    : MATCH_SCHEDULE[match.id];

  const accent = ROUND_ACCENT[match.round] ?? '#E8541A';

  const isDraw =
    homeTeam !== null && awayTeam !== null &&
    match.homeGoals !== null && match.awayGoals !== null &&
    match.homeGoals === match.awayGoals;

  const inputStyle: React.CSSProperties = {
    width: 30,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 700,
    padding: '2px 0',
    background: 'var(--color-bg-primary, #0B1120)',
    border: '1px solid var(--color-border, #374151)',
    borderRadius: 4,
    color: 'var(--color-primary, #F9FAFB)',
    outline: 'none',
    flexShrink: 0,
  };

  return (
    <div
      className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
      style={{ width: COL_W, boxSizing: 'border-box', borderLeft: `2px solid ${accent}` }}
    >
      {/* Header strip: match number + date/time */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2px 5px',
        fontSize: 9,
        color: accent,
        backgroundColor: `${accent}1A`,
        borderBottom: '1px solid rgba(75,85,99,0.25)',
      }}>
        <span style={{ fontWeight: 700 }}>
          {fixture ? `M${fixture.matchNum}` : match.id}
        </span>
        {sched && (
          <span style={{ opacity: 0.85 }}>
            {formatDate(sched.date)} · {sched.time}
          </span>
        )}
      </div>

      <div style={{ padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Home team row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, flex: 1, minWidth: 0, overflow: 'hidden',
            fontWeight: match.winnerId === match.homeTeam ? 700 : 400,
            color: match.winnerId === match.homeTeam ? accent : undefined,
          }}>
            {homeTeam
              ? <><FlagImage code={homeTeam.flag} size={20} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{homeTeam.name}</span></>
              : <span style={{ fontSize: 10, fontStyle: 'italic', color: '#6B7280' }}>TBD</span>
            }
          </span>
          {homeTeam && awayTeam ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <input
                type="number" min={0}
                value={homeVal}
                onChange={(e) => setHomeVal(e.target.value)}
                onBlur={() => commit(homeVal, awayVal)}
                placeholder="–"
                style={inputStyle}
              />
              {isDraw && (
                <button
                  title="Gana por penales"
                  onClick={() => setPenaltyWinner(match.id, match.homeTeam!)}
                  style={{
                    width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                    border: `1.5px solid ${match.winnerId === match.homeTeam ? accent : '#4B5563'}`,
                    backgroundColor: match.winnerId === match.homeTeam ? accent : 'transparent',
                    cursor: 'pointer', padding: 0,
                  }}
                />
              )}
            </div>
          ) : match.homeGoals !== null ? (
            <span style={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{match.homeGoals}</span>
          ) : null}
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: 'rgba(75,85,99,0.3)' }} />

        {/* Away team row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, flex: 1, minWidth: 0, overflow: 'hidden',
            fontWeight: match.winnerId === match.awayTeam ? 700 : 400,
            color: match.winnerId === match.awayTeam ? accent : undefined,
          }}>
            {awayTeam
              ? <><FlagImage code={awayTeam.flag} size={20} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{awayTeam.name}</span></>
              : <span style={{ fontSize: 10, fontStyle: 'italic', color: '#6B7280' }}>TBD</span>
            }
          </span>
          {homeTeam && awayTeam ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <input
                type="number" min={0}
                value={awayVal}
                onChange={(e) => setAwayVal(e.target.value)}
                onBlur={() => commit(homeVal, awayVal)}
                placeholder="–"
                style={inputStyle}
              />
              {isDraw && (
                <button
                  title="Gana por penales"
                  onClick={() => setPenaltyWinner(match.id, match.awayTeam!)}
                  style={{
                    width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                    border: `1.5px solid ${match.winnerId === match.awayTeam ? accent : '#4B5563'}`,
                    backgroundColor: match.winnerId === match.awayTeam ? accent : 'transparent',
                    cursor: 'pointer', padding: 0,
                  }}
                />
              )}
            </div>
          ) : match.awayGoals !== null ? (
            <span style={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{match.awayGoals}</span>
          ) : null}
        </div>


        {/* AI Analysis link */}
        {homeTeam && awayTeam && (
          <div style={{ marginTop: 3, borderTop: '1px solid rgba(75,85,99,0.3)', paddingTop: 3 }}>
            <Link
              href={`/bracket/${match.id}/analysis`}
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: 8,
                fontWeight: 700,
                padding: '2px 4px',
                borderRadius: 4,
                backgroundColor: '#00FF851A',
                color: '#00FF85',
                textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
            >
              AI Analysis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Round column — matches evenly distributed over TOTAL_H
// ---------------------------------------------------------------------------
function BracketColumn({
  title,
  matches,
  slots,
  round,
}: {
  title: string;
  matches: BracketMatch[];
  slots: number;
  round: string;
}) {
  const slotH  = TOTAL_H / slots;
  const accent = ROUND_ACCENT[round] ?? '#E8541A';

  return (
    <div style={{ width: COL_W, minWidth: COL_W, flexShrink: 0 }}>
      <div
        style={{
          fontSize: 9,
          height: HEADER_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: accent,
        }}
      >
        {title}
      </div>
      <div style={{ height: TOTAL_H, position: 'relative' }}>
        {matches.map((m, i) => (
          <div
            key={m.id}
            style={{
              position: 'absolute',
              top: i * slotH + slotH / 2 - CARD_H / 2,
              left: 0,
            }}
          >
            <MatchCard match={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Center column — Final + 3rd place
// ---------------------------------------------------------------------------
function CenterColumn({
  final: finalMatch,
  third: thirdMatch,
}: {
  final: BracketMatch | null;
  third: BracketMatch | null;
}) {
  const FINAL_TOP = TOTAL_H / 2 - CARD_H / 2 - 16;
  const THIRD_TOP = TOTAL_H * 0.75 - CARD_H / 2 - 16;

  return (
    <div style={{ width: CENTER_W, minWidth: CENTER_W, flexShrink: 0 }}>
      <div
        style={{
          fontSize: 9,
          height: HEADER_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: ROUND_ACCENT.F,
        }}
      >
        Final
      </div>
      <div style={{ height: TOTAL_H, position: 'relative' }}>
        {finalMatch && (
          <div style={{
            position: 'absolute', top: FINAL_TOP,
            left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: ROUND_ACCENT.F, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              🏆 World Cup Final
            </span>
            <MatchCard match={finalMatch} />
          </div>
        )}
        {thirdMatch && (
          <div style={{
            position: 'absolute', top: THIRD_TOP,
            left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: ROUND_ACCENT['3rd'], textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              🥉 Bronze Final
            </span>
            <MatchCard match={thirdMatch} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main BracketView
// ---------------------------------------------------------------------------
export default function BracketView() {
  const bracket      = useWorldCupStore((s) => s.bracket);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale]       = useState(1);
  const [containerW, setContainerW] = useState(0);

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth;
    setContainerW(w);
    setScale(w > 0 ? Math.min(1, w / NATURAL_W) : 1);
  }, []);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  const r32L = bracket.filter((m) => m.round === 'R32' && parseInt(m.id.split('-')[1]) <= 8);
  const r32R = bracket.filter((m) => m.round === 'R32' && parseInt(m.id.split('-')[1]) >= 9);
  const r16L = bracket.filter((m) => m.round === 'R16' && parseInt(m.id.split('-')[1]) <= 4);
  const r16R = bracket.filter((m) => m.round === 'R16' && parseInt(m.id.split('-')[1]) >= 5);
  const qfL  = bracket.filter((m) => m.round === 'QF'  && parseInt(m.id.split('-')[1]) <= 2);
  const qfR  = bracket.filter((m) => m.round === 'QF'  && parseInt(m.id.split('-')[1]) >= 3);
  const sfL  = bracket.find((m) => m.id === 'SF-1') ?? null;
  const sfR  = bracket.find((m) => m.id === 'SF-2') ?? null;
  const finalMatch = bracket.find((m) => m.round === 'F')    ?? null;
  const thirdMatch = bracket.find((m) => m.round === '3rd')  ?? null;

  const isPopulated = r32L[0]?.homeTeam !== null;

  if (!isPopulated) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border p-12 text-center"
        style={{ minHeight: 300, backgroundColor: '#111827', borderColor: '#1F2937', color: '#6B7280' }}
      >
        <div>
          <div className="text-4xl mb-4">🏆</div>
          <p className="text-sm font-medium">Bracket not yet populated.</p>
          <p className="text-xs mt-1">Complete all group stage matches and click &quot;Re-seed Bracket&quot;.</p>
        </div>
      </div>
    );
  }

  const translateX = scale < 1 ? 0 : Math.floor((containerW - NATURAL_W) / 2);

  return (
    <div ref={containerRef} style={{ width: '100%', height: NATURAL_H * scale, overflow: 'hidden' }}>
      <div
        style={{
          transformOrigin: 'top left',
          transform: `translate(${translateX}px, 0) scale(${scale})`,
          display: 'flex',
          alignItems: 'flex-start',
          width: NATURAL_W,
        }}
      >
        {/* ── LEFT HALF ─────────────────────────────────────────────────────── */}
        <BracketColumn title="Round of 32"    matches={r32L} slots={8} round="R32" />
        <RoundConnector fromSlots={8} toSlots={4} fromSide="left" />
        <BracketColumn title="Round of 16"    matches={r16L} slots={4} round="R16" />
        <RoundConnector fromSlots={4} toSlots={2} fromSide="left" restDay="Jul 8" />
        <BracketColumn title="Quarter-Finals" matches={qfL}  slots={2} round="QF" />
        <RoundConnector fromSlots={2} toSlots={1} fromSide="left" restDay="Jul 12–13" />
        <BracketColumn title="Semi-Finals"    matches={sfL ? [sfL] : []} slots={1} round="SF" />
        <SFConnector restDay="Jul 16–17" />

        {/* ── CENTER ────────────────────────────────────────────────────────── */}
        <CenterColumn final={finalMatch} third={thirdMatch} />

        {/* ── RIGHT HALF ────────────────────────────────────────────────────── */}
        <SFConnector restDay="Jul 16–17" />
        <BracketColumn title="Semi-Finals"    matches={sfR ? [sfR] : []} slots={1} round="SF" />
        <RoundConnector fromSlots={2} toSlots={1} fromSide="right" restDay="Jul 12–13" />
        <BracketColumn title="Quarter-Finals" matches={qfR}  slots={2} round="QF" />
        <RoundConnector fromSlots={4} toSlots={2} fromSide="right" restDay="Jul 8" />
        <BracketColumn title="Round of 16"    matches={r16R} slots={4} round="R16" />
        <RoundConnector fromSlots={8} toSlots={4} fromSide="right" />
        <BracketColumn title="Round of 32"    matches={r32R} slots={8} round="R32" />
      </div>
    </div>
  );
}
