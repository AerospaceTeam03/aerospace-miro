import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wingman",
    short_name: "Wingman",
    description:
      "Flight delay-risk decision tool for airline operations — which flights are about to go wrong, why, and what to do about it.",
    id: "/",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      { src: "/icons/logo_x96.png", sizes: "96x96", type: "image/png" },
      { src: "/icons/logo_x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/logo_x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
