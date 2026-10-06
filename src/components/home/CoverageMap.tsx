import DottedMap from "dotted-map";
import { destinationPorts, lanes, origin, originPorts, portByCode, type Port } from "@/content/site";

// Europe, the Mediterranean and the Gulf
const REGION = { lat: { min: 20, max: 58 }, lng: { min: -12, max: 54 } };
const COLOR = { origin: "#df9b67", destination: "#6fd0d6", lane: "#6fd0d6", hq: "#e7ecf3" } as const;

/** Rendered on the server: a dotted map with MKY's lanes from European ports to the Middle East */
export function CoverageMap() {
  const map = new DottedMap({ height: 46, grid: "diagonal", region: REGION });
  const viewBox = map.getSVG({}).match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 80 46";
  const [, , w, h] = viewBox.split(" ").map(Number);
  const dots = map
    .getPoints()
    .map((p) => `M${p.x} ${p.y}h0`)
    .join("");

  const pin = (p: { lat: number; lng: number }) => {
    const r = map.getPin({ lat: p.lat, lng: p.lng })!;
    return { x: r.x as number, y: r.y as number };
  };
  const hq = pin(origin);

  const label = (p: Port, x: number, y: number, color: string) => (
    <text
      x={p.label === "left" ? x - 0.9 : x + 0.9}
      y={p.label === "below" ? y + 2 : y - 0.7}
      textAnchor={p.label === "left" ? "end" : "start"}
      fontSize={1.3}
      fill={color}
      fontFamily="var(--font-geist-mono)"
    >
      {p.code}
    </text>
  );

  return (
    <figure className="relative">
      <svg viewBox={`0 -1 ${w} ${h + 2}`} className="h-auto w-full" role="img" aria-label="Map of MKY's shipping lanes from European ports to the Middle East and North Africa">
        <path d={dots} stroke="#1d3556" strokeWidth={0.38} strokeLinecap="round" />

        {lanes.map((l) => {
          const a = portByCode(l.from);
          const b = portByCode(l.to);
          if (!a || !b) return null;
          const p1 = pin(a);
          const p2 = pin(b);
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const cx = (p1.x + p2.x) / 2;
          const cy = (p1.y + p2.y) / 2 - Math.min(8, dist * 0.25);
          return (
            <path
              key={`${l.from}-${l.to}`}
              d={`M${p1.x} ${p1.y} Q${cx} ${cy} ${p2.x} ${p2.y}`}
              fill="none"
              stroke={COLOR.lane}
              strokeWidth={0.24}
              strokeDasharray="1 0.6"
              className="animate-dash glow-line"
              opacity={0.85}
            />
          );
        })}

        {originPorts.map((p) => {
          const { x, y } = pin(p);
          return (
            <g key={p.code}>
              <circle cx={x} cy={y} r={0.55} fill={COLOR.origin} className="glow-line" />
              {label(p, x, y, "#e7ecf3")}
            </g>
          );
        })}
        {destinationPorts.map((p) => {
          const { x, y } = pin(p);
          return (
            <g key={p.code}>
              <circle cx={x} cy={y} r={1.2} fill="none" stroke={COLOR.destination} strokeWidth={0.18} />
              <circle cx={x} cy={y} r={0.55} fill={COLOR.destination} />
              {label(p, x, y, "#e7ecf3")}
            </g>
          );
        })}

        <rect x={hq.x - 0.45} y={hq.y - 0.45} width={0.9} height={0.9} fill={COLOR.hq} transform={`rotate(45 ${hq.x} ${hq.y})`} />
        <text x={hq.x + 1} y={hq.y + 0.45} fontSize={1.15} fill="#aab6c8" fontFamily="var(--font-geist-mono)">KRK HQ</text>
      </svg>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-ink-400">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: COLOR.origin }} /> Port of loading</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: COLOR.destination }} /> Destination</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rotate-45" style={{ background: COLOR.hq }} /> Head office</span>
        <span className="ml-auto normal-case tracking-normal">Lanes from MKY&apos;s current shipments. Full list to be confirmed.</span>
      </figcaption>
    </figure>
  );
}
