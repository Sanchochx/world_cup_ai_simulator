'use client';

import { groups } from '@/data/groups';
import GroupCard from '@/components/GroupCard';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="font-display text-5xl font-bold mb-2" style={{ color: '#F9FAFB' }}>
          FIFA World Cup <span style={{ color: '#00FF85' }}>2026</span>
        </h1>
        <p style={{ color: '#6B7280' }} className="text-lg">48 teams · 12 groups · Interactive simulator with AI analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      <div className="mt-8 text-center text-xs" style={{ color: '#6B7280' }}>
        Click any group to enter scores · Scores auto-update standings · Click 🔍 ANALYSIS on any match for AI tactical breakdown
      </div>
    </div>
  );
}
