{
  // Set default config
  const config = {
    _lang: 'nb-NO',
    _words: [],
    _usedWords: [],
    _basePath: '/public/wordlists/',
    pointsElement: dqs('#points'),
    wordElement: dqs('#word'),
    optionsElements: dqs('#options'),
    wordlistPicker: dqs('#wordlist'),
    caseCheck: dqs('#case-check'),

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
          this._labels = list.labels
          this._words = list.words
          this._type = list.type || 'read'
          this._usedWords = []
        })
        .then(() => window.setNextWord())
    },

    get wordlistName() {
      const name = localStorage.getItem('wordlist') || 'no-short.json'
      this.wordlistName = name
      return name
    },

    set points(val) {
      this.pointsElement.textContent = val
    },

    get points() {
      return Number(this.pointsElement.textContent)
    }
  }

  // Update wordlist picker on page load
  config.wordlistPicker.value = config.wordlistName

  // Update wordlist on change
  config.wordlistPicker.addEventListener('change', async ({ target }) => {
    config.wordlistName = target.value
  })

  // Store case checkbox state on change
  config.caseCheck.addEventListener('change', async ({ target }) => {
    localStorage.setItem('upperCase', target.checked)
  })

  // Update the case checkbox on page load
  config.caseCheck.checked = (localStorage.getItem('upperCase') === 'true')

  // Speak the letter when clicked
  config.wordElement.addEventListener('click', ({ target, y, x }) => {
    if (target.tagName !== 'SPAN') return
    const letter = target.textContent
    window.speak(letter)
    notify(letter.toUpperCase(), { duration: 1500, style: { background: 'var(--bg-accent-color)', color: '#222222', fontSize: '1.5rem' } })
  })

  // Use resize observer to fix width of word element
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { target } = entry

      // Check height (fixes text alignment if multiple lines)
      target.classList.remove('w-min-content')
      target.classList.toggle('w-min-content', (target.offsetHeight > 100))

      // Check if width is overflowing
      target.classList.remove('small-text')
      const isOverflowing = (target.offsetWidth > window.innerWidth)
      target.classList.toggle('small-text', isOverflowing)
    })
  })

  resizeObserver.observe(config.wordElement)

  // Function to set next word
  window.setNextWord = () => {
    const nextWord = config.nextWord.toString()

    // Check if math
    if (config._type === 'math') {
      // Calc correct answer
      const correctAnswer = eval(nextWord)

      // Get two alternative answers that are not the same and not the correct answer using the randomNumber function
      const alternatives = []
      while (alternatives.length < 2) {
        const num = randomNumber(correctAnswer, 20)
        if (num !== correctAnswer && !alternatives.includes(num)) alternatives.push(num)
      }

      // Add correct answer
      alternatives.push(correctAnswer)

      // Create button elements and attach listeners
      const optionElements = alternatives.map((num, i) => {
        const btn = document.createElement('button')
        btn.value = num
        btn.textContent = num

        btn.addEventListener('click', () => {
          // Set results
          const isCorrect = (i === alternatives.length - 1)
          const result = isCorrect ? config._labels.correct : config._labels.incorrect

          // Notification options
          const options = {
            duration: 1500,
            style: {
              background: isCorrect ? 'var(--bg-accent-color)' : 'darkorange',
              color: '#222222',
              fontSize: '1.5rem'
            }
          }

          // Notify and speak result
          window.notify(result, options)
          window.speak(result)

          // If correct, inc points and load next word
          if (isCorrect) {
            config.points++
            setTimeout(window.setNextWord, 500)
          }

          // If incorrect, reset points and disable btn
          else {
            config.points = 0
            btn.disabled = true
          }
        })
        return btn
      })

      // Shuffle order
      shuffleArray(optionElements)

      // Set options
      config.optionsElements.replaceChildren(...optionElements)
    }

    // Clear options if not math
    else config.optionsElements.replaceChildren()

    const spanWrapped = nextWord.split('').map((c) => (c === ' ') ? ' ' : `<span role="button">${c}</span>`).join('')
    config.wordElement.innerHTML = spanWrapped

    // Set font-size based on word length
    const wordLength = nextWord.length
    const { style } = config.wordElement
    switch (true) {
      case (wordLength > 15): style.fontSize = '3rem'; break
      case (wordLength > 10): style.fontSize = '4rem'; break
      default: style.removeProperty('font-size')
    }

    // Text to speech
    window.speak = (text = config.wordElement.textContent) => {
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
}