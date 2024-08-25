import { helpers } from './helpers.js'
import { edge } from './init.js'

const mw = async ({ state, response }, next) => {
  // console.log('## Adding template render function')

  // Add object for global template data
  state.templateData = {
    helpers
  }

  // Use .render() namespace
  response.render = async (template, routeData) => {
    console.log(`## Render template: ${template}`)
    const { templateData } = state

    // Create engine to attach locals (share)
    const view = edge.createRenderer()
    view.share({ ...templateData, ...routeData })

    // Render template with route data
    const html = await view.render(template)

    // Set response body
    response.body = html
  }

  await next()
}

export { mw }