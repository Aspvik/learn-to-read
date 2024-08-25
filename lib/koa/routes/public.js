import send from 'koa-send'
import path from 'node:path'

const staticOptions = {
  root: './lib/public'
}

const route = async (ctx) => {
  const filepath = path.resolve(ctx.path.replace('/public', ''))
  console.log(`## Sending file: ${filepath}`)
  await send(ctx, filepath, staticOptions)
}

export { route }