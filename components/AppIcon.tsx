"use client";

import { useEffect, useState } from "react";

type AppIconProps = {
  src?: string;
  fallback: string;
  alt: string;
  size?: number;
};

export default function AppIcon({
  src,
  fallback,
  alt,
  size = 24,
}: AppIconProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <span
        aria-label={alt}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${size}px`,
          lineHeight: 1,
        }}
      >
        {fallback}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}