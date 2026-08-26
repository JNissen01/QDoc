import type { SVGProps } from "react";

export function CirclePlusIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        d="M10.0003 1.66602C5.40033 1.66602 1.66699 5.39935 1.66699 9.99935C1.66699 14.5993 5.40033 18.3327 10.0003 18.3327C14.6003 18.3327 18.3337 14.5993 18.3337 9.99935C18.3337 5.39935 14.6003 1.66602 10.0003 1.66602ZM14.167 10.8327H10.8337V14.166H9.16699V10.8327H5.83366V9.16602H9.16699V5.83268H10.8337V9.16602H14.167V10.8327Z"
        fill="currentColor"
      />
    </svg>
  );
}
