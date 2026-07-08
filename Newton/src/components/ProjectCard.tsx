import type { ProjectData } from "../types";

export function ProjectCard({ card }: { card: ProjectData }) {
  return (
    <div className="card">
      <div>
        <h2>{card.topic}</h2>
        <p className="projectDescription">{card.description}</p>
        {card.projectAuthor && (
          <span className="projectAuthor">ავტორი: {card.projectAuthor}</span>
        )}
      </div>
      <div className="cardFooter">
        <span className="gradeTag">{card.grade}-ე კლასი</span>
        {card.url && (
          <a href={card.url} className="cardLink" target="_blank" rel="noreferrer">
            {card.urlName || "იხილეთ მეტი"}
          </a>
        )}
      </div>
    </div>
  );
}