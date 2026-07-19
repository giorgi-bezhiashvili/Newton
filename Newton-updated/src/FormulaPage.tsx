import { CardsPage } from "./components/cardPage";
import { FormulaCard } from "./components/FormulaCard";
import { AddFormulaForm } from "./components/AddFormulaForm";
import { useAuth } from "./contexts/AuthContext";
import type { FormulaData } from "./types";

function FormulasPage() {
  const { isAuthenticated } = useAuth();

  return (
    <CardsPage<FormulaData>
      endpoint="formulas"
      renderCard={(card, refetch) => <FormulaCard card={card} onChanged={refetch} />}
      renderAddForm={isAuthenticated ? (onAdded) => <AddFormulaForm onAdded={onAdded} /> : undefined}
      searchMatch={(card, searchLower, searchClean) => {
        const equationString = Array.isArray(card.equation)
          ? card.equation.join(" ").toLowerCase()
          : String(card.equation).toLowerCase();
        return (
          card.topic.toLowerCase().includes(searchLower) ||
          card.grade.toString().includes(searchLower) ||
          equationString.includes(searchLower) ||
          equationString.replace(/\s+/g, "").includes(searchClean)
        );
      }}
    />
  );
}

export default FormulasPage;