import sse from 'koa-sse-stream'

const route = sse({
  maxClients: 10,
  pingInterval: 10000,
  closeEvent: 'reload'
})

let serverEvent
const mw = async (ctx, next) => {
  if (!serverEvent) serverEvent = ctx.sse
  await next()
}

const reloadClient = () => {
  if (!serverEvent) return console.warn('No server event found')
  serverEvent.send('reload')
}



export { route, mw, reloadClient }