import { CardsPage } from "./components/cardPage";
import { ProjectCard } from "./components/ProjectCard";
import type { ProjectData } from "./types";

function ProjectsPage() {
  return (
    <CardsPage<ProjectData>
      endpoint="projects"
      renderCard={(card) => <ProjectCard card={card} />}
      searchMatch={(card, searchLower) =>
        card.topic.toLowerCase().includes(searchLower) ||
        card.grade.toString().includes(searchLower) ||
        card.description.toLowerCase().includes(searchLower) ||
        (card.projectAuthor?.toLowerCase().includes(searchLower) ?? false)
      }
    />
  );
}

export default ProjectsPage;