import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import {
  getAllProjectIndexPairs,
  getProjectPair,
  getProjectSlugs,
} from "@/lib/works";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pair = getProjectPair(slug);
  const project = pair?.en ?? pair?.ko;
  if (!project) {
    return { title: "Project not found — Mankeun Jeong" };
  }
  const description = project.overview
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
  return {
    title: `${project.title} — Mankeun Jeong`,
    description: description || undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const pair = getProjectPair(slug);
  if (!pair || (!pair.en && !pair.ko)) notFound();
  const allPairs = getAllProjectIndexPairs();
  return <ProjectDetail pair={pair} allPairs={allPairs} />;
}
