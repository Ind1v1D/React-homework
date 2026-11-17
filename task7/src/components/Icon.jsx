// One icon set: 24px grid, 1.75 stroke, round caps, currentColor.
// `fill` turns the shape solid (used for rating stars that are "on").
const SHAPES = {
  star: <path d="M12 3.2l2.75 5.6 6.15.9-4.45 4.35 1.05 6.15L12 17.3l-5.5 2.9 1.05-6.15L3.1 9.7l6.15-.9L12 3.2z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.4-4.4" />
    </>
  ),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  film: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4" />
    </>
  ),
  "wifi-off": (
    <>
      <path d="M3 3l18 18" />
      <path d="M5 12.9a10 10 0 015.2-2.8M19 12.9a10 10 0 00-2.5-1.9M8.5 16.4a5 5 0 017 0" />
      <path d="M12 20h.01" />
    </>
  ),
};

function Icon({ name, fill = false, className = "" }) {
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {SHAPES[name]}
    </svg>
  );
}

export default Icon;
