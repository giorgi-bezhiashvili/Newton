import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { type CardData } from "./types";
import { useParams } from "react-router-dom";

const BATCH_SIZE = 9;
const SEARCH_DEBOUNCE_MS = 200;

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
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        <span style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          verticalAlign: 'middle',
          padding: '0 6px',
          minWidth: '50px'
        }}>
          <span style={{
            borderBottom: '1px solid currentColor',
            padding: '2px 6px',
            fontSize: '0.95em',
            textAlign: 'center',
            width: '100%'
          }}>
            {numerator.trim()}
          </span>
          <span style={{
            fontSize: '0.95em',
            paddingTop: '4px',
            textAlign: 'center',
            width: '100%'
          }}>
            {denominator.trim()}
          </span>
        </span>
        {multiplier && <span style={{ paddingLeft: '4px' }}>{multiplier.trim()}</span>}
      </span>
    );
  }

  return <span style={{ padding: '0 4px' }}>{text.trim()}</span>;
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
    const [leftSide, rightSide] = targetText.split("=");
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {prefix && <span style={{ color: '#a0aec0', marginRight: '4px' }}>{prefix.trim()}</span>}
        <RenderFraction text={leftSide} />
        <span>=</span>
        <RenderFraction text={rightSide} />
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
      {prefix && <span style={{ color: '#a0aec0', marginRight: '4px' }}>{prefix.trim()}</span>}
      <RenderFraction text={targetText} />
    </span>
  );
}

// Wrapped in useMemo so the regex/split work only reruns when `text` actually changes,
// not on every re-render of the parent card.
function FormatEquation({ text }: { text: string }) {
  const content = useMemo(() => {
    if (text.includes(":")) {
      const [labelText, equationText] = text.split(":");

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '0.95em', color: '#a0aec0', textAlign: 'center' }}>
            {labelText.trim()}:
          </span>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProcessEquation text={equationText} />
          </div>
        </div>
      );
    }

    return <ProcessEquation text={text} />;
  }, [text]);

  return content;
}

function SecondPage() {
  const [cards, setCards] = useState<CardData[]>([]);

  // searchInput updates instantly (so typing feels responsive);
  // searchQuery is the debounced value that actually drives filtering.
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { param } = useParams();

 useEffect(() => {
  if (!param) return;

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/api/${param}`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CardData[] = await response.json();
      setCards(data);
      setVisibleCount(BATCH_SIZE); // Reset count here when a new route data loads!
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchCards();
}, [param]);

  // Debounce: wait until the user pauses typing for 200ms before updating
  // the value that actually triggers filtering.
// Debounce: wait until the user pauses typing for 200ms before updating
// the value that actually triggers filtering.
useEffect(() => {
  const timeout = setTimeout(() => {
    setSearchQuery(searchInput);
    setVisibleCount(BATCH_SIZE); // Reset count here when search changes!
  }, SEARCH_DEBOUNCE_MS);

  return () => clearTimeout(timeout);
}, [searchInput]);

  // Only recompute the filtered list when the cards or the debounced query change,
  // not on every render.
  const filteredCards = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    const searchClean = searchLower.replace(/\s+/g, "");

    return cards.filter((card) => {
      const matchTopic = card.topic.toLowerCase().includes(searchLower);
      const matchGrade = card.grade.toString().includes(searchLower);

      const equationString = Array.isArray(card.equation)
        ? card.equation.join(" ").toLowerCase()
        : String(card.equation).toLowerCase();

      const equationClean = equationString.replace(/\s+/g, "");

      return (
        matchTopic ||
        matchGrade ||
        equationString.includes(searchLower) ||
        equationClean.includes(searchClean)
      );
    });
  }, [cards, searchQuery]);


  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredCards.length));
        }
      },
      { rootMargin: "200px" } // start loading a bit before it's actually on screen
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filteredCards.length]);

  const visibleCards = filteredCards.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCards.length;

  return (
    <div className="space-page">
      <Header />
      <main className="mainContent">
        <div className="searchWrapper">
          <input
            type="text"
            className="searchInput"
            placeholder="ძებნა (მაგ: თემა, კლასი)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="cardsContainer">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card cardSkeleton">
                <div>
                  <div className="skeletonLine skeletonTitle" />
                  <div className="skeletonLine" />
                  <div className="skeletonLine skeletonShort" />
                </div>
                <div className="cardFooter">
                  <div className="skeletonLine skeletonTag" />
                </div>
              </div>
            ))
          ) : filteredCards.length > 0 ? (
            visibleCards.map((card) => (
              <div key={card._id} className="card">
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
            ))
          ) : (
            <div className="noResults">
              <p>შესაბამისი მასალა ვერ მოიძებნა</p>
            </div>
          )}
        </div>

        {hasMore && (
          <div ref={sentinelRef} className="loadMoreSentinel">
            <div className="card cardSkeleton">
              <div>
                <div className="skeletonLine skeletonTitle" />
                <div className="skeletonLine" />
                <div className="skeletonLine skeletonShort" />
              </div>
              <div className="cardFooter">
                <div className="skeletonLine skeletonTag" />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SecondPage;