import { useEffect, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { type CardData } from "./types";
import { useParams } from "react-router-dom";

function SecondPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const { param } = useParams();

  useEffect(() => {
    // თუ URL ჯერ კიდევ ცარიელია, რექვესტი არ გაუშვას
    if (!param) return; 

    const fetchCards = async () => {
      try {
        // თუ ბრაუზერში წერია /formulas, რექვესტი წავა აქ: http://localhost:3000/api/formulas
        const response = await fetch(`http://localhost:3000/api/${param}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CardData[] = await response.json();
        setCards(data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, [param]); // აუცილებელია [param], რათა URL-ის შეცვლაზე რეაგირება მოახდინოს

  return (
    <>
      <Header />
      <main>
        <div className="cardsContainer">
          {cards.map((card) => (
            <div key={card._id} className="card">
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

              <p className="gradeTag">{card.grade}-ე კლასი</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default SecondPage;
