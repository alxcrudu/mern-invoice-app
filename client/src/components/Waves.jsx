export default function Waves() {
  return (
    <svg
      className="waves | absolute bottom-0 text-[#775EF1]"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shapeRendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g className="parallax">
        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(119,94,241,.4)" />
        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(119,94,241,.6)" />
        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(119,94,241,.8)" />
        <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(119,94,241,1)" />
      </g>
    </svg>
  );
}
