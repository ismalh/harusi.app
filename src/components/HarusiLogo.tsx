import { Link } from "@tanstack/react-router";

interface HarusiLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-7xl",
};

export function HarusiLogo({ size = "md", className = "" }: HarusiLogoProps) {
  return (
    <span className={`harusi-wordmark inline-flex items-baseline ${sizes[size]} ${className}`}>
      H
      <span className="relative inline-block">
        A
        {/* Gold leaf flourish under the A crossbar */}
        <svg
          aria-hidden
          viewBox="0 0 40 12"
          className="absolute left-1/2 -translate-x-1/2 top-[55%] w-[0.7em] h-auto"
        >
          <path
            d="M2 8 Q 12 0, 22 6 T 38 4"
            stroke="var(--color-gold)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
      RUSI
    </span>
  );
}

export function HarusiLogoLink({ size = "sm" }: { size?: HarusiLogoProps["size"] }) {
  return (
    <Link to="/home" className="inline-flex">
      <HarusiLogo size={size} />
    </Link>
  );
}
