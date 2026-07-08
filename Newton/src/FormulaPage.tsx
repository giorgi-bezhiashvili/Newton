import { CardsPage } from "./components/cardPage";
import { FormulaCard } from "./components/FormulaCard";
import type { FormulaData } from "./types";

function FormulasPage() {
  return (
    <CardsPage<FormulaData>
      endpoint="formulas"
      renderCard={(card) => <FormulaCard card={card} />}
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