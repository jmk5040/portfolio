import type { Metadata } from "next";
import { CV } from "@/components/CV";

export const metadata: Metadata = {
  title: "C.V. — Mankeun Jeong",
  description: "Education, résumé, and downloadable PDF for Mankeun Jeong.",
};

export default function CVPage() {
  return <CV />;
}
