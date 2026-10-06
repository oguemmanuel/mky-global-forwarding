import { ImageResponse } from "next/og";

export const alt = "MKY Global Forwarding: vehicle shipping from Europe to the Middle East";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a1424",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff6a1a", fontSize: 30, fontWeight: 700 }}>
            M
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>MKY GLOBAL FORWARDING</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 950 }}>Vehicle shipping from Europe to the Middle East.</div>
          <div style={{ fontSize: 28, color: "#a9b5c9" }}>Ro-Ro · Export documents · Track by VIN · Kraków, Poland</div>
        </div>
        <div style={{ display: "flex", height: 8, width: 240, background: "#ff6a1a", borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
