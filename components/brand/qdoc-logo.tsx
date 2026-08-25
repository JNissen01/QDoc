export function QDocLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 360 92"
        className="mx-auto h-[64px] w-auto"
        role="img"
        aria-label="QDoc"
      >
        <circle cx="42" cy="42" r="34" fill="#1e1b4b" />
        <path
          d="M66 64l16 16"
          stroke="#1e1b4b"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="36" y="24" width="12" height="36" rx="2" fill="#fff" />
        <rect x="24" y="36" width="36" height="12" rx="2" fill="#fff" />

        <circle cx="148" cy="42" r="34" fill="#425bc7" />
        <circle cx="148" cy="42" r="15" fill="#f0f4ff" />

        <path
          d="M202 8h24c22 0 40 15 40 34s-18 34-40 34h-24V8zm18 16v36h8c12 0 22-8 22-18s-10-18-22-18h-8z"
          fill="#1e1b4b"
        />

        <path
          d="M348 42c0 15-12 28-28 28-10 0-18-4-24-11l11-11c3 4 8 7 13 7 7 0 13-6 13-13s-6-13-13-13c-5 0-10 3-13 7l-11-11c6-7 14-11 24-11 16 0 28 13 28 28z"
          fill="#425bc7"
        />
      </svg>
      <p className="mt-2 text-center text-[15px] leading-5 font-medium text-ink">
        Virtual Healthcare
      </p>
    </div>
  );
}
