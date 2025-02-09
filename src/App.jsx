import React from 'react';
import { languages } from './languages.js';
import { getFarewellText, generateRandomWord } from './messages.js'
import clsx from 'clsx';
import { useWindowSize } from 'react-use';
import Confetti from "react-confetti";

export default function App() {

  const [currentWord, setCurrentWord] = React.useState( () => generateRandomWord());
  const [guessedLetters, setGuessedLetters] = React.useState([]);
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessedCorrect = lastGuessedLetter && currentWord.includes(lastGuessedLetter)

  const gameStatus = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && !isLastGuessedCorrect && guessedLetters.length > 0
  })

  function startNewGame(){
    setCurrentWord(generateRandomWord())
    setGuessedLetters([])
  }

  function addGuessedLetter(letter) {
    setGuessedLetters(previousLetters => previousLetters.includes(letter) ? previousLetters : [...previousLetters, letter])
  }

  function renderGameStatus() {
    if (!isGameOver && !isLastGuessedCorrect && guessedLetters.length > 0) {
      return <p className="farewell-message">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
    }

    if (isGameWon) {
      const { width, height } = useWindowSize
      return (
        <>
        <Confetti width={width}height={height} recycle={false} numberOfPieces={1000} />
        <h2>You win! 🎉</h2>
        <p>Nicely done! You have saved the remaining programming languages!</p>
        </>
      )
    }
    
    if (isGameLost) {
      return (
        <>
          <h2>You lost! 😭</h2>
          <p>Better start learning Assembly i guess... </p>
        </>
      )
    }
    return null
  }

  const languageElements = languages.map(
    (language, index) => {
      const isLanguageLost = index < wrongGuessCount
      const styles = { backgroundColor: language.backgroundColor, color: language.color }
      return (<span className={`prog-language ${isLanguageLost ? "lost" : ""}`} key={index} style={styles}>{language.name}</span>)
    }
  )

  const wordElements = currentWord.split('').map((letter, index) => {
    const revealLetter =  isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )

    return (<span className={letterClassName} key={index}>{revealLetter ? letter.toUpperCase() : ""}</span>)
  })

  const keyboard = "abcdefghijklmnopqrstuvwxyz".split('').map((letter) => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (<button disabled={isGameOver} className={className} onClick={() => addGuessedLetter(letter)} key={letter}>{letter.toUpperCase()}</button>)
  })

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section className={gameStatus}>
        {renderGameStatus()}
      </section>
      <section className="language-display">
        {languageElements}
      </section>
      <section className="word-display">
        {wordElements}
      </section>
      <section className="keyboard-display">
        {keyboard}
      </section>
      {isGameOver && <button onClick={ () => startNewGame() } className="button-display">New Game</button>}
    </main>
  )
}
