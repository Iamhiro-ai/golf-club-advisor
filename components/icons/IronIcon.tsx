
import React from 'react';

interface IconProps {
  className?: string;
}

export const IronIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.4,3.29C17.47,2.36,16.11,2.05,15,2.47L8.94,4.21C8.39,4.36,8,4.89,8,5.47V16.6L3.2,20.79a1,1,0,0,0,0,1.42,1,1,0,0,0,1.41,0L10,16.83l3.78,3.78a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.42L11.41,15.4l5.22-1.94c1.07-.4,1.69-1.51,1.69-2.7V4.7A1.89,1.89,0,0,0,18.4,3.29ZM10,13.17V6.59l5-.29V10.8Z"/>
  </svg>
);
