import Router from '@koa/router'
import mount from 'koa-mount'
import { middlewares } from './middleware.js'
import { route as home } from './routes/home.js'

// Init router
const router = new Router()

// Mount middlewares
router.use(middlewares)


// Mount routes
router.get('/', home)

export { router }