{
  // Load words
  const words = await fetch('/public/wordlists/no.json').then(res => res.json())

  // Get element containing the word
  const wordElement = dqs('#word')

  window.setNextWord = () => {
    const nextWord = words[Math.floor(Math.random() * words.length)]
    wordElement.textContent = nextWord
  }
  setNextWord()
}