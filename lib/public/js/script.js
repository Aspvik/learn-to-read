{
  // Get UI elements
  const wordElement = dqs('#word')
  const wordlistPicker = dqs('#wordlist')

  // Set wordlist base path
  const basePath = '/public/wordlists/'

  // Get active wordlist from local storage
  let activeWordlist = localStorage.getItem('wordlist') || 'no-short.json'
  wordlistPicker.value = activeWordlist

  // Array of words
  let words

  // Function to set next word
  window.setNextWord = () => {
    const nextWord = words[Math.floor(Math.random() * words.length)]
    wordElement.textContent = nextWord
  }

  // Function for loading wordlist
  window.loadWordlist = async () => {
    words = await fetch(basePath + activeWordlist).then(res => res.json())
  }
  await loadWordlist()
  setNextWord()

  // Event listener for wordlist picker
  wordlistPicker.addEventListener('change', async ({ target }) => {
    activeWordlist = target.value
    localStorage.setItem('wordlist', activeWordlist)
    await loadWordlist()
    setNextWord()
  })
}