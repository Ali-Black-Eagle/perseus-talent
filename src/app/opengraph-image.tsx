import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const runtime = "edge";

export const alt = "Perseus Talent — UK Healthcare Recruitment Consultancy";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#1C052E",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Top bar: Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "4px",
              border: "1px solid #C5A15B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C5A15B",
              fontSize: "24px",
            }}
          >
            ✦
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "36px",
                fontWeight: 600,
                letterSpacing: "0.14em",
              }}
            >
              PERSEUS
            </span>
            <span
              style={{
                color: "#C5A15B",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.32em",
              }}
            >
              TALENT
            </span>
          </div>
        </div>

        {/* Center: Statement */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}>
          <span
            style={{
              color: "#C5A15B",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            UK Healthcare Recruitment Consultancy
          </span>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: "56px",
              fontWeight: 500,
              lineHeight: 1.15,
            }}
          >
            The right people. The right opportunities. A better future.
          </span>
          <span
            style={{
              color: "rgba(255, 255, 255, 0.75)",
              fontSize: "24px",
              marginTop: "20px",
              lineHeight: 1.4,
            }}
          >
            {site.positioning}
          </span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "24px",
            color: "#C5A15B",
            fontSize: "16px",
          }}
        >
          <span>Transparent 15% Flat Rate Fee</span>
          <span>perseustalent.co.uk</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
