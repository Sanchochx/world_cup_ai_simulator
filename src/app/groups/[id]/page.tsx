'use client';

import { notFound } from 'next/navigation';
import { groups } from '@/data/groups';
import { useWorldCupStore } from '@/store/worldcupStore';
import GroupTable from '@/components/GroupTable';
import MatchCard from '@/components/MatchCard';
import Link from 'next/link';

export default function GroupPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const group = groups.find((g) => g.id === id.toUpperCase());
  if (!group) notFound();

  const scores = useWorldCupStore((s) => s.scores);
  const setScore = useWorldCupStore((s) => s.setScore);
  const getGroupTable = useWorldCupStore((s) => s.getGroupTable);

  const table = getGroupTable(group.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/" className="text-sm" style={{ color: '#6B7280' }}>← All Groups</Link>
        <h1 className="font-display text-3xl font-bold" style={{ color: '#F9FAFB' }}>
          {group.name}
        </h1>
      </div>

      {/* Group Table */}
      <div className="rounded-xl border mb-8 overflow-hidden" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: '#1F2937' }}>
          <h2 className="font-display font-semibold" style={{ color: '#F9FAFB' }}>Standings</h2>
        </div>
        <GroupTable rows={table} />
      </div>

      {/* Fixtures */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: '#1F2937' }}>
          <h2 className="font-display font-semibold" style={{ color: '#F9FAFB' }}>Matches</h2>
        </div>
        <div className="p-4 space-y-3">
          {group.fixtures.map((fixture) => (
            <MatchCard
              key={fixture.id}
              fixture={fixture}
              score={scores[fixture.id]}
              onScoreChange={(h, a) => setScore(fixture.id, h, a)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
