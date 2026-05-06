import { HomeIntro } from "@/components/HomeIntro";
import { ProjectIndex } from "@/components/ProjectIndex";
import { getAllProjectIndexPairs } from "@/lib/works";

export default function HomePage() {
  const pairs = getAllProjectIndexPairs();
  return (
    <>
      <HomeIntro />
      <ProjectIndex pairs={pairs} />
    </>
  );
}
