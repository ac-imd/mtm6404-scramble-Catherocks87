/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
const { useState, useEffect } = React;

const words = ["apple", "banana", "cherry", "date", "fig", "grape", "kiwi", "lemon", "mango", "orange"];
const maxStrikes = 3;
const maxPasses = 2;

function shuffle(src) {
  const copy = [...src];
  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }
  if (typeof src === "string") {
    return copy.join("");
  }
  return copy;
}
/**********************************************
 * YOUR CODE BELOW
 **********************************************/
function App() {
  const [gameState, setGameState] = useState(() => {
    const savedState = JSON.parse(localStorage.getItem("scrambleGameState"));
    return savedState || {
      words: shuffle(words),
      currentWordIndex: 0,
      points: 0,
      strikes: 0,
      passes: maxPasses,
      feedback: "",
    };
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("scrambleGameState", JSON.stringify(gameState));
  }, [gameState]);

  const handleGuess = () => {
    const currentWord = gameState.words[gameState.currentWordIndex];
    if (input.toLowerCase() === currentWord) {
      setGameState((prevState) => ({
        ...prevState,
        currentWordIndex: prevState.currentWordIndex + 1,
        points: prevState.points + 1,
        feedback: "Correct!",
      }));
    } else {
      setGameState((prevState) => ({
        ...prevState,
        strikes: prevState.strikes + 1,
        feedback: "Incorrect. Try again.",
      }));
    }
    setInput("");
  };

  const handlePass = () => {
    if (gameState.passes > 0) {
      setGameState((prevState) => ({
        ...prevState,
        currentWordIndex: prevState.currentWordIndex + 1,
        passes: prevState.passes - 1,
        feedback: "Passed.",
      }));
    }
  };

  const handleRestart = () => {
    setGameState({
      words: shuffle(words),
      currentWordIndex: 0,
      points: 0,
      strikes: 0,
      passes: maxPasses,
      feedback: "",
    });
    setInput("");
  };

  const currentScrambledWord = shuffle(gameState.words[gameState.currentWordIndex]);
  const gameOver = gameState.currentWordIndex >= gameState.words.length || gameState.strikes >= maxStrikes;

  return (
    <div className="container">
      <h1>Welcome to Scramble</h1>
      {gameOver ? (
        <div>
          <h2>Game Over</h2>
          <p>Your Score: {gameState.points}</p>
          <button onClick={handleRestart}>Play Again</button>
        </div>
      ) : (
        <div>
          <div className="word">{currentScrambledWord}</div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleGuess()}
          />
          <button onClick={handleGuess}>Guess</button>
          <button onClick={handlePass} disabled={gameState.passes <= 0}>
            Pass ({gameState.passes})
          </button>
          <div className="feedback">{gameState.feedback}</div>
          <div className="score">
            Points: {gameState.points} | Strikes: {gameState.strikes}/{maxStrikes}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));