import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostDetail } from "@/components/PostDetail";
import {
  getPostIndexPairs,
  getPostPair,
  getPostSlugs,
} from "@/lib/posts";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pair = getPostPair(slug);
  const post = pair?.en ?? pair?.ko;
  if (!post) return { title: "Post not found — Mankeun Jeong" };
  return {
    title: `${post.title} — Mankeun Jeong`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.date || undefined,
      tags: post.tags,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const pair = getPostPair(slug);
  if (!pair || (!pair.en && !pair.ko)) notFound();
  const allPairs = getPostIndexPairs();
  return <PostDetail pair={pair} allPairs={allPairs} />;
}
