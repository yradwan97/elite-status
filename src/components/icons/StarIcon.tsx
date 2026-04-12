import { FC } from 'react';

interface StarIconProps {
  size?: number;
  className?: string;
  filled?: boolean;
  color?: string;
}

export const StarIcon: FC<StarIconProps> = ({
  size = 24,
  className = "",
  filled = false,
  color = "#FACC15", // Default yellow color matching your image
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={filled ? "none" : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};