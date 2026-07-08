import type { AssignmentData } from "../types";

export function AssignmentCard({ card }: { card: AssignmentData }) {
  return (
    <div className="card">
      <div>
        <h2>{card.topic}</h2>
        <ul className="assignmentsList">
          {card.assignments.map((task, index) => (
            <li key={index} className="assignmentItem">
              {task}
            </li>
          ))}
        </ul>
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