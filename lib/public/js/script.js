{
  // Set default config
  const config = {
    _basePath: '/public/wordlists/',

    // Getters and setters
    get language() {
      return this._lang
    },
    get nextWord() {
      const { _words, _usedWords } = this
      const wordIndex = Math.floor(Math.random() * _words.length)

      // Reset used words if all words are used
      if (_usedWords.length === _words.length) this._usedWords = []

      // Ensure not already used
      if (_usedWords.includes(wordIndex)) return this.nextWord

      // Keep track of used words
      _usedWords.push(wordIndex)

      // Return word
      return _words[wordIndex]
    },

    // Save and load wordlist
    set wordlistName(name) {
      localStorage.setItem('wordlist', name)

      // Load wordlist
      fetch(this._basePath + name)
        .then(res => res.json())
        .then(list => {
          this._lang = list.language
          this._words = list.words
          this._usedWords = []
        })
        .then(() => window.setNextWord())
    },

    get wordlistName() {
      const name = localStorage.getItem('wordlist') || 'no-short.json'
      this.wordlistName = name
      return name
    }
  }

  // Get UI elements
  const wordElement = dqs('#word')
  const wordlistPicker = dqs('#wordlist')
  // Update wordlist picker on page load
  wordlistPicker.value = config.wordlistName

  // Update wordlist on change
  wordlistPicker.addEventListener('change', async ({ target }) => {
    config.wordlistName = target.value
  })

  // Speak the letter when clicked
  wordElement.addEventListener('click', ({ target, y, x }) => {
    if (target.tagName !== 'SPAN') return
    const letter = target.textContent
    window.speak(letter)
    notify(letter.toUpperCase(), { duration: 1500, style: { background: 'var(--bg-accent-color)', color: '#222222', fontSize: '1.5rem' } })
  })

  // Function to set next word
  window.setNextWord = () => {
    const nextWord = config.nextWord.toString()
    const spanWrapped = nextWord.split('').map((c) => (c === ' ') ? ' ' : `<span role="button">${c}</span>`).join('')
    wordElement.innerHTML = spanWrapped
  }

  // Text to speech
  window.speak = (text = wordElement.textContent) => {
    if (!window.speechSynthesis) {
      return window.notify('Text to speech is not supported in this browser')
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = config.language
    utterance.rate = 1
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)

  }
}