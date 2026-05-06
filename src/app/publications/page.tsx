import type { Metadata } from "next";
import { Publications } from "@/components/Publications";
import {
  getJournalPapers,
  getPress,
  getWritings,
} from "@/lib/publications";

export const metadata: Metadata = {
  title: "Publications — Mankeun Jeong",
  description:
    "Refereed astronomy papers and essays on cosmology, technology, and the imagination by Mankeun Jeong.",
};

export default function PublicationsPage() {
  const journalPapers = getJournalPapers();
  const writings = getWritings();
  const press = getPress();
  return (
    <Publications
      journalPapers={journalPapers}
      writings={writings}
      press={press}
    />
  );
}
