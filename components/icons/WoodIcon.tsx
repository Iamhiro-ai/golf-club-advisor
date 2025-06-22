
import React from 'react';

interface IconProps {
  className?: string;
}

export const WoodIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.5,6.5A5.44,5.44,0,0,0,16,4H8A5.44,5.44,0,0,0,3.5,6.5L3,18H21ZM8,6h8a3.49,3.49,0,0,1,2.54,1.08L17.22,8.5H6.78L5.46,7.08A3.49,3.49,0,0,1,8,6Z"/>
  </svg>
);
