'use client'

import { ArrowDown } from 'lucide-react';
import posthog from 'posthog-js';

const ExploreBtn = () => {
  const handleClick = () => {
    posthog.capture('explore_events_clicked');
  };

  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={handleClick}>
        <a href="#events">
            Explore Events
            <ArrowDown className='h-4.5 w-4.5' />
        </a>
    </button>
  )
}

export default ExploreBtn