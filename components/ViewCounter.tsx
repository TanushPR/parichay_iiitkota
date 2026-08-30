'use client';

import { useEffect, useRef, useState } from 'react';

const STARTING_VIEWS = 3000;
const STORAGE_KEY = 'parichay_view_count';

export default function ViewCounter() {
  const [views, setViews] = useState(STARTING_VIEWS);
  const countedRefresh = useRef(false);

  useEffect(() => {
    // Prevent React Strict Mode from counting the same refresh twice in development.
    if (countedRefresh.current) return;
    countedRefresh.current = true;

    const storedViews = Number.parseInt(localStorage.getItem(STORAGE_KEY) || '', 10);
    const currentViews = Number.isFinite(storedViews) && storedViews >= STARTING_VIEWS ? storedViews : STARTING_VIEWS;
    const nextViews = currentViews + 1;

    localStorage.setItem(STORAGE_KEY, nextViews.toString());
    setViews(nextViews);
  }, []);

  return <>{views.toLocaleString('en-IN')}</>;
}
