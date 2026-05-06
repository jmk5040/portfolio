import type { Metadata } from "next";
import { PostsIndex } from "@/components/PostsIndex";
import { getAllTags, getPostIndexPairs } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Posts — Mankeun Jeong",
  description:
    "Casual notes, reading, and rough drafts from the studio of Mankeun Jeong.",
};

export default function PostsPage() {
  const pairs = getPostIndexPairs();
  const tags = getAllTags();
  return <PostsIndex pairs={pairs} tags={tags} />;
}
