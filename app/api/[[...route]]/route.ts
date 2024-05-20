import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
// import { HTTPException } from 'hono/http-exception'
import { handle } from 'hono/vercel'

import signup from '@/app/api/routes/auth/sign-up'

// export const runtime = 'edge'

const app = new Hono().basePath('/api')

// app.onError((err, c) => {
//   if (err instanceof HTTPException) {
//     return err.getResponse()
//   }

//   return c.json({ error: 'Internal Server Error' }, 500)
// })

app.get('/hello', c => {
  return c.json({
    message: 'Hello Next.js!'
  })
})

const routes = app.route('/signup', signup)

export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof routes
