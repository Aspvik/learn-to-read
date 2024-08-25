// Frontend / Client code
import { Edge } from 'edge.js'

// Init Edge.js
const edge = Edge.create({
  cache: process.env.NODE_ENV === 'production'
})

// Mount views
edge.mount(new URL('./views', import.meta.url))

export { edge }