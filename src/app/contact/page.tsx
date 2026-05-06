import type { Metadata } from "next";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Mankeun Jeong",
  description: "Email, studio, and social channels for Mankeun Jeong.",
};

export default function ContactPage() {
  return <Contact />;
}
