import { useEffect, useState } from "react";

function App() {
  const [totalCards, setTotalCards] = useState(12);
  const [cards, setCards] = useState([]);
  const [firstFlippedCard, setFirstFlippedCard] = useState(null);
  const [secondFlippedCard, setSecondFlippedCard] = useState(null);

  const handleNoOfCards = (e) => {
    const value = parseInt(e.target.value);
    if (value % 4 === 0 && value > 0) {
      setTotalCards(value);
    }
  };

  useEffect(() => {
    const generateCards = () => {
      const sameCards = totalCards / 2;
      const newCards = [];

      for (let i = 0; i < sameCards; i++) {
        const value = i + 1;
        newCards.push(
          { id: crypto.randomUUID(), value, isFlipped: false, isMatched: false },
          { id: crypto.randomUUID(), value, isFlipped: false, isMatched: false }
        );
      }

      for (let i = newCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
      }

      return newCards;
    };

    setCards(generateCards());
    setFirstFlippedCard(null);
    setSecondFlippedCard(null);
  }, [totalCards]);

  const handleFlip = (i) => {
    if (cards[i].isFlipped || cards[i].isMatched || secondFlippedCard !== null) return;

    const newCards = [...cards];
    newCards[i].isFlipped = true;
    setCards(newCards);

    if (firstFlippedCard === null) {
      setFirstFlippedCard(i);
    } else if (secondFlippedCard === null) {
      setSecondFlippedCard(i);
      setTimeout(() => {
        if (newCards[firstFlippedCard].value === newCards[i].value) {
          newCards[firstFlippedCard].isMatched = true;
          newCards[i].isMatched = true;
        } else {
          newCards[firstFlippedCard].isFlipped = false;
          newCards[i].isFlipped = false;
        }
        setCards(newCards);
        setFirstFlippedCard(null);
        setSecondFlippedCard(null);
      }, 700);
    }
  };

  const matchedCount = cards.filter(card => card.isMatched).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 flex justify-center items-center gap-2">
            🧠 Memory Match
          </h1>
          <p className="text-gray-600">Flip cards to find all the matching pairs!</p>
        </header>

        {/* Input Control */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-500">
            <span className="font-semibold">Number of cards (multiple of 4)</span>
            <input
              type="number"
              min={4}
              step={4}
              placeholder="e.g. 12"
              className="mt-1 block mx-auto w-40 px-3 py-1 border border-gray-300 rounded text-center shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
              onChange={handleNoOfCards}
            />
          </label>
          <div className="text-xs text-gray-500 space-x-4">
            <span>Total Cards: <strong>{totalCards}</strong></span>
            <span>Flipped: <strong>{cards.filter(c => c.isFlipped).length}</strong></span>
            <span>Matched: <strong>{matchedCount / 2}</strong></span>
          </div>
          {matchedCount === totalCards && (
            <p className="text-green-500 font-bold animate-bounce">🎉 You Win!</p>
          )}
        </div>

        {/* Cards Grid */}
        <div className={`grid gap-4 mt-6 justify-center 
          ${totalCards <= 12 ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-4 sm:grid-cols-6'}`}>
          {cards.map((card, i) => (
            <div
              key={card.id}
              onClick={() => handleFlip(i)}
              className={`
                aspect-square w-[90px] sm:w-[100px] md:w-[110px] lg:w-[120px]
                bg-white rounded-lg shadow-md flex items-center justify-center
                text-2xl sm:text-3xl font-semibold cursor-pointer
                transform transition-all duration-200 ease-in-out
                hover:scale-95 active:scale-90
                ${card.isMatched ? 'bg-green-100 cursor-default' : ''}
                ${card.isFlipped || card.isMatched ? 'text-indigo-700 bg-white' : 'bg-indigo-100 text-red-500'}
              `}
            >
              {card.isFlipped || card.isMatched ? card.value : "?"}
            </div>
          ))}
        </div>

        {/* Regame Button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 
            text-white font-semibold rounded-full shadow-md 
            hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200"
        >
          🔁 Regame
        </button>

        {/* Footer */}
        <footer className="pt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} Memory Game. Made with 💙 || Made By Jeet
        </footer>
      </div>
    </div>
  );
}

export default App;
