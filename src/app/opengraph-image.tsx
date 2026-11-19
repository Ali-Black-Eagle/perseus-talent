import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = "Perseus Talent — UK Healthcare Recruitment Consultancy";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function toDataUri(buf: Buffer, mime: string) {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export default async function Image() {
  const logoBuf = await readFile(
    join(process.cwd(), "public/brand/logo-full.png"),
  );
  const logo = toDataUri(logoBuf, "image/png");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FBF9F6",
          padding: "40px 56px",
          borderBottom: "10px solid #1C052E",
        }}
      >
        {/* Full logo on ivory */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          width={600}
          height={421}
          alt=""
          style={{ width: "600px", height: "421px" }}
        />

        {/* Statement */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "56px",
            flex: 1,
            borderLeft: "2px solid #C5A15B",
            paddingLeft: "48px",
          }}
        >
          <span
            style={{
              color: "#7A5A20",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              marginBottom: "18px",
              textTransform: "uppercase",
            }}
          >
            UK Healthcare Recruitment
          </span>
          <span
            style={{
              color: "#1C052E",
              fontSize: "40px",
              fontWeight: 600,
              lineHeight: 1.18,
            }}
          >
            The right people. The right opportunities. A better future.
          </span>
          <span
            style={{
              color: "#4A3A5A",
              fontSize: "20px",
              marginTop: "22px",
              lineHeight: 1.4,
            }}
          >
            {site.positioning}
          </span>
          <span
            style={{
              color: "#7A5A20",
              fontSize: "18px",
              marginTop: "26px",
            }}
          >
            Transparent 15% Flat Rate Fee · perseustalent.co.uk
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
