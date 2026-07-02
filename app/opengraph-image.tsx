import { ImageResponse } from "next/og";

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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#171717",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#171717",
            }}
          >
            IF
          </div>
          <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1 }}>
            InvoiceFlow
          </div>
        </div>
        <div style={{ fontSize: 30, color: "#a3a3a3" }}>
          Professional invoices in under 60 seconds
        </div>
      </div>
    ),
    { ...size }
  );
}
