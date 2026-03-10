'use client'

import { ArrowDown } from 'lucide-react';


const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto">
        <a href="#events">
            Explore Events
            <ArrowDown className='h-4.5 w-4.5' />
        </a>
    </button>
  )
}

export default ExploreBtn