import { useEffect, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { type CardData } from "./types";
import { useParams } from "react-router-dom";

function SecondPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { param } = useParams();

  useEffect(() => {
    if (!param) return;

    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/${param}`, {
          method: "GET",
          headers: {
            "Bypass-Tunnel-Reminder": "true",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CardData[] = await response.json();
        setCards(data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [param]);

  const filteredCards = cards.filter((card) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      card.topic.toLowerCase().includes(searchLower) ||
      card.grade.toString().includes(searchLower)
    );
  });

  return (
    <>
      <Header />
      <main className="mainContent">
        <div className="searchWrapper">
          <input
            type="text"
            className="searchInput"
            placeholder="ძებნა (მაგ: თემა, კლასი)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            filteredCards.map((card) => (
              <div key={card._id} className="card">
                <div>
                  <h2>{card.topic}</h2>
                  <div className="equationsList">
                    {Array.isArray(card.equation) ? (
                      card.equation.map((eq, index) => (
                        <p key={index} className="equationLine">
                          {eq}
                        </p>
                      ))
                    ) : (
                      <p className="equationLine">{card.equation}</p>
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
              <p>შესაბამისი ფორმულა ვერ მოიძებნა</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default SecondPage;