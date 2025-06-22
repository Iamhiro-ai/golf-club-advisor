
import React from 'react';

interface IconProps {
  className?: string;
}

export const GolfBagIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path 
      fillRule="evenodd"
      d="M4.5 21.5 L4.5 13 C4.5 12.5 4.3 11.5 5.0 11.0 Q5.5 10.5 6.0 11.0 T6.8 10.0 Q7.2 9.5 7.8 10.0 T8.5 9.0 Q9.0 8.5 9.8 9.0 T10.5 10.0 Q11.0 9.5 12.0 8.5 T13.0 9.5 Q13.5 9.0 14.2 9.0 T15.0 10.0 Q15.5 9.5 16.2 10.0 T17.0 9.0 Q17.5 8.5 18.2 9.0 T19.0 11.0 C19.2 11.5 19.5 12.5 19.5 13 L19.5 21.5 H4.5 Z" 
      clipRule="evenodd"
    />
  </svg>
);
