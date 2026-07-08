import { CardsPage } from "./components/cardPage";
import { AssignmentCard } from "./components/AssignmentCard";
import type { AssignmentData } from "./types";

function AssignmentsPage() {
  return (
    <CardsPage<AssignmentData>
      endpoint="assignments"
      renderCard={(card) => <AssignmentCard card={card} />}
      searchMatch={(card, searchLower) =>
        card.topic.toLowerCase().includes(searchLower) ||
        card.grade.toString().includes(searchLower) ||
        card.assignments.some((a) => a.toLowerCase().includes(searchLower))
      }
    />
  );
}

export default AssignmentsPage;