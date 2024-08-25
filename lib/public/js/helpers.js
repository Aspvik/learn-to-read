const dqs = document.querySelector.bind(document)
const dqsa = document.querySelectorAll.bind(document)

window.createEl = (html) => {
  const el = document.createElement('div')
  el.insertAdjacentHTML('afterbegin', html)
  return el.firstElementChild
}

// Notifications
window.notify = (title, body) => {
  if (!body) {
    title = 'Ding dong!'
    body = title
  }

  Toastify({
    text: `<b>${title}</b><br><span>${body}</span>`,
    escapeMarkup: false,
    duration: 5000,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: 'pink',
    },
  }).showToast()
}

// Server sent events (hot reload)
{
  const sse = new EventSource('/sse')
  sse.addEventListener('message', (event) => {
    console.log(event)
  })

  sse.addEventListener('close', (event) => {
    console.log(event)
  })

  sse.addEventListener('reload', (event) => {
    console.log(event)
  })
}