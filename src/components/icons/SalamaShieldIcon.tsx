import React from 'react';

interface SalamaShieldIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const SalamaShieldIcon: React.FC<SalamaShieldIconProps> = ({ size = 24, className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 12l4.5-4.5" />
      <path d="M12 12L7.5 7.5" />
      <path d="M12 8v4" />
    </svg>
  );
};

export default SalamaShieldIcon;
