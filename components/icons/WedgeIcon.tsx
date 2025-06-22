
import React from 'react';

interface IconProps {
  className?: string;
}

export const WedgeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.78,3.22a2.5,2.5,0,0,0-3.54,0L5.53,13.93a1,1,0,0,0,0,1.41L7,16.76l-3.79,3.79a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l3.79-3.79,1.42,1.42a1,1,0,0,0,1.41,0L20.78,8.53a2.5,2.5,0,0,0,0-3.54ZM8.08,16.05l-1-1L15,7.12l1,1ZM6.24,19.17l2.83-2.83,1,1-2.83,2.83Z"/>
  </svg>
);
