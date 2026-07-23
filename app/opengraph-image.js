import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #0e1d57 0%, #1c44cc 55%, #22bf9d 130%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "white",
              color: "#1c44cc",
              fontSize: 56,
              fontWeight: 700,
            }}
          >
            T
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, color: "white" }}>
            {SITE_NAME}
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: "#dce8ff",
            display: "flex",
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size }
  );
}
