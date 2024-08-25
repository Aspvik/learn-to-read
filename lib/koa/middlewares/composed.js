import compose from "koa-compose"
import { mw as render } from '../../edge/render.js'

const middlewares = compose([
  render
])

export { middlewares }