import DottedMap from "dotted-map";
import { lanes, origin } from "@/content/site";

const REGION = { lat: { min: -12, max: 64 }, lng: { min: -26, max: 134 } };
const MODE_COLOR = { air: "#df9b67", sea: "#6fd0d6", road: "#8aa4b8" } as const;

/** Rendered on the server at build time: a dotted world map with example lanes from Kraków */
export function CoverageMap() {
  const map = new DottedMap({ height: 44, grid: "diagonal", region: REGION });
  const viewBox = map.getSVG({}).match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 68 44";
  const [, , w, h] = viewBox.split(" ").map(Number);
  // One path for all dots keeps the HTML small
  const dots = map
    .getPoints()
    .map((p) => `M${p.x} ${p.y}h0`)
    .join("");

  const o = map.getPin({ lat: origin.lat, lng: origin.lng })!;
  const pins = lanes.map((l) => {
    const pin = map.getPin({ lat: l.lat, lng: l.lng })!;
    return { ...l, x: pin.x as number, y: pin.y as number };
  });

  return (
    <figure className="relative">
      <svg viewBox={`0 -2 ${w} ${h + 4}`} className="h-auto w-full" role="img" aria-label="Map of example freight lanes from Kraków">
        <path d={dots} stroke="#1d3556" strokeWidth={0.34} strokeLinecap="round" />
        {pins.map((p) => {
          const dx = p.x - o.x;
          const dy = p.y - o.y;
          const dist = Math.hypot(dx, dy);
          const cx = (o.x + p.x) / 2 - dy * 0.18;
          const cy = (o.y + p.y) / 2 - Math.min(10, dist * 0.32);
          return (
            <g key={p.code}>
              <path
                d={`M${o.x} ${o.y} Q${cx} ${cy} ${p.x} ${p.y}`}
                fill="none"
                stroke={MODE_COLOR[p.mode]}
                strokeWidth={0.22}
                strokeDasharray={p.mode === "road" ? "0.4 0.6" : "1 0.6"}
                className="animate-dash glow-line"
                opacity={0.9}
              />
              <circle cx={p.x} cy={p.y} r={0.45} fill={MODE_COLOR[p.mode]} />
              <text
                x={p.label === "left" ? p.x - 0.8 : p.x + 0.8}
                y={p.label === "below" ? p.y + 1.8 : p.y - 0.6}
                textAnchor={p.label === "left" ? "end" : "start"}
                fontSize={1.25}
                fill="#aab6c8"
                fontFamily="var(--font-geist-mono)"
              >
                {p.code}
              </text>
            </g>
          );
        })}
        <circle cx={o.x} cy={o.y} r={1.3} fill="none" stroke="#e0662c" strokeWidth={0.2} />
        <circle cx={o.x} cy={o.y} r={0.6} fill="#e0662c" className="glow-line" />
        <text x={o.x + 1.6} y={o.y + 0.5} fontSize={1.5} fontWeight={600} fill="#fff" fontFamily="var(--font-geist-mono)">
          KRK
        </text>
      </svg>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-ink-400">
        {(["air", "sea", "road"] as const).map((m) => (
          <span key={m} className="flex items-center gap-2">
            <span className="inline-block h-0.5 w-5" style={{ background: MODE_COLOR[m] }} />
            {m}
          </span>
        ))}
        <span className="ml-auto normal-case tracking-normal">Example lanes. Final list to be confirmed by MKY.</span>
      </figcaption>
    </figure>
  );
}
