import React from 'react';
import { languages } from './languages.js';
import clsx from 'clsx';

export default function App() {

  const [currentWord, setCurrentWord] = React.useState("react");
  const [guessedLetters, setGuessedLetters] = React.useState([]);


  function addGuessedLetter(letter) {
    setGuessedLetters( previousLetters =>  previousLetters.includes(letter) ? previousLetters : [...previousLetters, letter]) 
  }

  const languageElements = languages.map(
    (language, index) => {
      const styles = { backgroundColor: language.backgroundColor, color: language.color }
      return (<span className="single-language" key={index} style={styles}>{language.name}</span>)
    }
  )

  const wordElements = currentWord.split('').map((letter, index) => {
    return (<span key={index}>{letter.toUpperCase()}</span>)
  })

  const keyboard = "abcdefghijklmnopqrstuvwxyz".split('').map((letter) => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (<button className={className} onClick={ () => addGuessedLetter(letter) } key={letter}>{letter.toUpperCase()}</button>)
  })

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section className="game-status">
        <h2>You win! 🎉</h2>
        <p>Nicely done! You have saved the remaining programming languages!</p>
      </section>
      <section className="language-catalogs">
        {languageElements}
      </section>
      <section className="word-display">
        {wordElements}
      </section>
      <section className="keyboard-display">
        {keyboard}
      </section>
      <button className="button-display">New Game</button>
    </main>
  )
}
