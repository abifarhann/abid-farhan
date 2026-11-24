import { ImageResponse } from "next/og";
import { portfolio } from "@/data/portfolio";

export const alt = "Abid Farhan Abdullah | Full-Stack Developer / Backend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", background: "#141414", color: "#F5F5F3" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#b7b7ae" }}>
        <span>AF / SELECTED WORK</span><span>WEB · BACKEND · REAL-TIME</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: "-7px", lineHeight: 1.05 }}>ABID / FARHAN</div>
        <div style={{ fontSize: 28, marginTop: 28 }}>{portfolio.role}</div>
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #474741", paddingTop: 22, fontSize: 20, color: "#b7b7ae" }}>{portfolio.name}</div>
    </div>,
    size,
  );
}
