import Koa from 'koa'
import { router } from './koa/router.js'

const { LTR_HTTP_PORT: HTTP_PORT } = process.env

// Init Koa
const app = new Koa({ proxy: true })

// Mount router
app.use(router.routes())

// Error handling
app.on('error', (err) => console.error(err))

// Start server
app.listen(HTTP_PORT)
console.log(`## Server running on port ${HTTP_PORT}`)