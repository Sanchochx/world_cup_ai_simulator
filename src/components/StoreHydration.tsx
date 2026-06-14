'use client';

import { useEffect } from 'react';
import { useWorldCupStore } from '@/store/worldcupStore';

export default function StoreHydration() {
  useEffect(() => {
    useWorldCupStore.persist.rehydrate();
  }, []);
  return null;
}
