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
    caseToggle: dqs('#case-toggle'),

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

  const voiceSelects = {
    'nb-NO': dqs('#norwegian-voice'),
    'en-US': dqs('#english-voice')
  }
  const selectedVoices = Object.fromEntries(
    Object.keys(voiceSelects).map(language => [language, localStorage.getItem(`voice:${language}`) || ''])
  )

  const matchesVoiceLanguage = (voice, language) => {
    if (language === 'nb-NO') return /^(nb|nn|no)(-|$)/i.test(voice.lang)
    return /^en(-|$)/i.test(voice.lang)
  }

  const updateVoiceSelects = () => {
    const voices = window.speechSynthesis?.getVoices() || []

    for (const [language, select] of Object.entries(voiceSelects)) {
      const options = [new Option('Standard', '')]
      for (const voice of voices.filter(voice => matchesVoiceLanguage(voice, language))) {
        options.push(new Option(`${voice.name} (${voice.lang})`, voice.voiceURI))
      }

      select.replaceChildren(...options)
      select.value = selectedVoices[language]
      if (select.selectedIndex === -1) select.value = ''
    }
  }

  for (const [language, select] of Object.entries(voiceSelects)) {
    select.addEventListener('change', () => {
      selectedVoices[language] = select.value
      if (select.value) localStorage.setItem(`voice:${language}`, select.value)
      else localStorage.removeItem(`voice:${language}`)
    })
  }

  window.speechSynthesis?.addEventListener('voiceschanged', updateVoiceSelects)
  updateVoiceSelects()

  const settingsDialog = dqs('#settings-dialog')
  dqs('#settings-open').addEventListener('click', () => settingsDialog.showModal())

  const createUtterance = (text) => {
    // Account for - being read as hyphen
    const utterance = new SpeechSynthesisUtterance(text.replace(/-/g, 'minus'))
    utterance.lang = config.language
    utterance.rate = config.language === 'nb-NO' ? 1.2 : 1
    utterance.pitch = config.language === 'nb-NO' ? 1 : 1.1

    const selectedVoiceURI = selectedVoices[config.language]
    const selectedVoice = selectedVoiceURI && window.speechSynthesis?.getVoices().find(voice =>
      voice.voiceURI === selectedVoiceURI && matchesVoiceLanguage(voice, config.language)
    )
    if (selectedVoice) {
      utterance.voice = selectedVoice
      utterance.lang = selectedVoice.lang
    }

    return utterance
  }

  window.warmUpSpeech = () => {
    if (!window.speechSynthesis) return

    // Start the iPhone speech engine during the Start button's user gesture.
    const utterance = createUtterance('a')
    utterance.volume = 0
    window.speechSynthesis.speak(utterance)
  }

  window.speak = (text) => {
    if (!window.speechSynthesis) {
      return window.notify('Text to speech is not supported in this browser')
    }

    window.speechSynthesis.speak(createUtterance(text))
  }

  // Update wordlist picker on page load
  config.wordlistPicker.value = config.wordlistName

  // Update wordlist on change
  config.wordlistPicker.addEventListener('change', async ({ target }) => {
    config.wordlistName = target.value
  })

  const setCaseToggle = (upperCaseEnabled) => {
    config.caseToggle.setAttribute('aria-pressed', String(upperCaseEnabled))
    config.caseToggle.textContent = upperCaseEnabled ? 'AA' : 'Aa'
  }

  config.caseToggle.addEventListener('click', () => {
    const upperCaseEnabled = config.caseToggle.getAttribute('aria-pressed') !== 'true'
    setCaseToggle(upperCaseEnabled)
    localStorage.setItem('upperCase', upperCaseEnabled)
  })

  setCaseToggle(localStorage.getItem('upperCase') === 'true')

  // Speak the letter when clicked
  config.wordElement.addEventListener('click', ({ target, y, x }) => {
    if (target.tagName !== 'SPAN') return
    const letter = target.textContent
    window.speak(letter)
    notify(letter.toUpperCase(), { duration: 1500, style: { background: 'var(--bg-accent-color)', color: '#222222', fontSize: '1.5rem' } })
  })

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
  }
}
