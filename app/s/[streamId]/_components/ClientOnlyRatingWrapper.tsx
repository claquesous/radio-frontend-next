'use client';

import { useEffect, useState } from 'react';
import Rating from './rating'; // Assuming 'rating.tsx' is in the same directory

export default function ClientOnlyRatingWrapper(props: { rating: number }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Render nothing on the server
  }

  return <Rating {...props} />;
}
