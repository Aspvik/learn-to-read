import Router from '@koa/router'
import { middlewares } from './middlewares/composed.js'
import { route as sse } from './middlewares/sse.js'
import { route as home } from './routes/home.js'
import { route as publicFiles } from './routes/public.js'

// Init router
const router = new Router()

// Mount middlewares
router.use(middlewares)
router.get('/sse', sse)

// Mount routes
router.get('/public/(.*)', publicFiles)

// UI
router.get('/', home)

export { router }