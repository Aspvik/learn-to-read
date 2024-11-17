const dqs = document.querySelector.bind(document)
const dqsa = document.querySelectorAll.bind(document)

window.createEl = (html) => {
  const el = document.createElement('div')
  el.insertAdjacentHTML('afterbegin', html)
  return el.firstElementChild
}

// Notifications
window.notify = (text, options = {}) => {
  Toastify({
    text,
    duration: 5000,
    gravity: 'top',
    position: 'center',
    style: {
      background: '#0f3443',
    },
    ...options
  }).showToast()
}

const randomNumber = (n, percent) => {
  const offset = (percent / 100)
  const lowerBound = n - (n * offset)
  const upperBound = n + (n * offset)
  const result = Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound)

  // Ensure result is not the same as n
  return (result === n) ? randomNumber(n, percent) : result
}

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5)
