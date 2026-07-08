import { useMemo } from "react";
import type { FormulaData } from "../types";

function RenderFraction({ text }: { text: string }) {
  let cleanText = text.trim();
  let multiplier = "";

  const parenFractionMatch = cleanText.match(/^\(([^)]+)\)\s*\*?\s*(.*)$/);
  if (parenFractionMatch) {
    cleanText = parenFractionMatch[1];
    multiplier = parenFractionMatch[2];
  }

  if (cleanText.includes("/")) {
    const [numerator, denominator] = cleanText.split("/");
    return (
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", padding: "0 6px", minWidth: "50px" }}>
          <span style={{ borderBottom: "1px solid currentColor", padding: "2px 6px", fontSize: "0.95em", textAlign: "center", width: "100%" }}>
            {numerator.trim()}
          </span>
          <span style={{ fontSize: "0.95em", paddingTop: "4px", textAlign: "center", width: "100%" }}>
            {denominator.trim()}
          </span>
        </span>
        {multiplier && <span style={{ paddingLeft: "4px" }}>{multiplier.trim()}</span>}
      </span>
    );
  }

  return <span style={{ padding: "0 4px" }}>{text.trim()}</span>;
}

function ProcessEquation({ text }: { text: string }) {
  let prefix = "";
  let targetText = text;

  const match = text.match(/^([ა-ჰ\s]+)(.*)$/);
  if (match) {
    prefix = match[1];
    targetText = match[2];
  }

  if (targetText.includes("=")) {
    const parts = targetText.split("=");
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        {prefix && <span style={{ color: "#a0aec0", marginRight: "4px" }}>{prefix.trim()}</span>}
        {parts.flatMap((part, i) =>
          i < parts.length - 1
            ? [<RenderFraction key={`f-${i}`} text={part} />, <span key={`eq-${i}`}>=</span>]
            : [<RenderFraction key={`f-${i}`} text={part} />]
        )}
      </span>
    );
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", flexWrap: "wrap" }}>
      {prefix && <span style={{ color: "#a0aec0", marginRight: "4px" }}>{prefix.trim()}</span>}
      <RenderFraction text={targetText} />
    </span>
  );
}

function FormatEquation({ text }: { text: string }) {
  const content = useMemo(() => {
    if (text.includes(":")) {
      const [labelText, equationText] = text.split(":");
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "100%", marginBottom: "12px" }}>
          <span style={{ fontSize: "0.95em", color: "#a0aec0", textAlign: "center" }}>{labelText.trim()}:</span>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <ProcessEquation text={equationText} />
          </div>
        </div>
      );
    }
    return <ProcessEquation text={text} />;
  }, [text]);

  return content;
}

export function FormulaCard({ card }: { card: FormulaData }) {
  return (
    <div className="card">
      <div>
        <h2>{card.topic}</h2>
        <div className="equationsList">
          {Array.isArray(card.equation) ? (
            card.equation.map((eq, index) => (
              <p key={index} className="equationLine">
                <FormatEquation text={String(eq)} />
              </p>
            ))
          ) : (
            <p className="equationLine">
              <FormatEquation text={String(card.equation)} />
            </p>
          )}
        </div>
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