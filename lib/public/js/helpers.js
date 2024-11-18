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

// Will return a positive number with 0 decimals that is not the same as N
const randomNumber = (inputNumber) => {
  // If input number is 0 or undefined, set it to a random number between 1 and 10
  const n = inputNumber || Math.floor(Math.random() * 10)

  // Set offset percentage based on N for the following cases: <10, <30, <50, <100, <200
  let offset;
  switch (true) {
    case (n < 10): offset = 0.8; break;
    case (n < 30): offset = 0.3; break;
    case (n < 50): offset = 0.2; break;
    default: offset = 0.1;
  }

  // Set lower and upper bounds based on N
  const lowerBound = n - (n * offset)
  const upperBound = n + (n * offset)
  const result = Math.abs(Math.ceil(Math.random() * (upperBound - lowerBound + 1) + lowerBound))

  // Ensure result is not the same as n or 0 (inputNumber)
  return (result === n || result === inputNumber) ? randomNumber(inputNumber) : result
}

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5)
