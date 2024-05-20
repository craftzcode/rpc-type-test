import { getSignedCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'

export const jwt = createMiddleware(async (c, next) => {
  // const jwtMiddleware = jwt({
  //   secret: c.env.JWT_SECRET,
  //   cookie: 'sessionToken',
  //   alg: 'HS256'
  // })
  // return jwtMiddleware(c, next)

  const sessionToken = await getSignedCookie(
    c,
    process.env.COOKIE_SECRET!,
    'sessionToken'
  )

  // const sessionToken = getCookie(c, 'sessionToken')

  if (!sessionToken) return c.json({ error: 'Unauthorized' }, 401)

  await verify(sessionToken, c.env.JWT_SECRET, 'HS256')
    .then(payload => {
      c.set('jwtPayload', payload)
    })
    .catch(() => {
      return c.json({ error: 'Unauthorized' }, 401)
    })

  await next()
})
