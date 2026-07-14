import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Familiar",
  description: "Administración de personas, fotos y teléfonos",
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
