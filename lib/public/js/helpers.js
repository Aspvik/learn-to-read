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