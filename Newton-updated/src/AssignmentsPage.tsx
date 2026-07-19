// src/AssignmentsPage.tsx
import { CardsPage } from "./components/cardPage";
import { AssignmentCard } from "./components/AssignmentCard";
import { AddAssignmentForm } from "./components/AddAssignmentForm";
import { useAuth } from "./contexts/AuthContext";
import type { AssignmentData } from "./types";

function AssignmentsPage() {
  const { isAuthenticated } = useAuth();

  return (
    <CardsPage<AssignmentData>
      endpoint="assignments"
      renderCard={(card, refetch) => <AssignmentCard card={card} onChanged={refetch} />}
      renderAddForm={isAuthenticated ? (onAdded) => <AddAssignmentForm onAdded={onAdded} /> : undefined}
      searchMatch={(card, searchLower) =>
        card.topic.toLowerCase().includes(searchLower) ||
        card.grade.toString().includes(searchLower) ||
        card.assignments.some((a) => a.toLowerCase().includes(searchLower))
      }
    />
  );
}

export default AssignmentsPage;