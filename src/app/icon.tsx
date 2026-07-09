import { ImageResponse } from "next/og";

export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0e14",
          color: "#e8a020",
          fontFamily: "monospace",
          fontSize: 56,
          fontWeight: 700,
          borderRadius: 16,
        }}
      >
        $_
      </div>
    ),
    size,
  );
}
