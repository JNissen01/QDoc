export function QDocLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 228 70"
        className="mx-auto h-[48px] w-auto"
        role="img"
        aria-label="qdoc"
      >
        {/* q — navy with medical-cross cutout and sharp tail */}
        <g fill="#1e1b4b">
          <path
            fillRule="evenodd"
            d="M32 2c16.569 0 30 13.431 30 30S48.569 62 32 62 2 48.569 2 32 15.431 2 32 2Zm-3.5 17h7v8.5h8.5v7H35.5v8.5h-7v-8.5H20v-7h8.5V19Z"
          />
          <path d="M50 52.5 63.5 66a4.25 4.25 0 0 1-6 6L44.2 58.7A30.2 30.2 0 0 0 50 52.5Z" />
        </g>

        {/* Connected lowercase doc in action blue */}
        <g fill="#425bc7">
          {/* d */}
          <path d="M88 4h14c18.778 0 34 15.222 34 34s-15.222 34-34 34H88V4Zm13 12.5v43h1c11.874 0 21.5-9.626 21.5-21.5S113.874 16.5 102 16.5h-1Z" />
          {/* o — overlaps d */}
          <path
            fillRule="evenodd"
            d="M136 12c17.673 0 32 14.327 32 32s-14.327 32-32 32-32-14.327-32-32 14.327-32 32-32Zm0 12.5c-10.77 0-19.5 8.73-19.5 19.5s8.73 19.5 19.5 19.5 19.5-8.73 19.5-19.5-8.73-19.5-19.5-19.5Z"
          />
          {/* c — overlaps o */}
          <path d="M210 32c0-17.673-14.327-32-32-32-9.6 0-18.28 4.23-24.2 11l10.45 10.45c3.5-4 8.55-6.45 13.75-6.45 9.665 0 17.5 7.835 17.5 17.5S177.665 50 168 50c-5.2 0-10.25-2.45-13.75-6.45L143.8 54c5.92 6.77 14.6 11 24.2 11 17.673 0 32-14.327 32-32Z" />
        </g>
      </svg>
      <p className="mt-3 text-center text-[15px] leading-5 font-medium text-ink">
        Virtual Healthcare
      </p>
    </div>
  );
}
