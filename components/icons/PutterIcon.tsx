
import React from 'react';

interface IconProps {
  className?: string;
}

export const PutterIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13,3H11V15H4v2H11v4h2V17h7V15H13Z"/>
  </svg>
);
