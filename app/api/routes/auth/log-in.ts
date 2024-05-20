import { db } from '@/drizzle/drizzle'
import { users } from '@/drizzle/schema'
import { zValidator } from '@hono/zod-validator'
import bcrypt from 'bcrypt'
import { eq, or } from 'drizzle-orm'
import { Hono } from 'hono'
import { setCookie, setSignedCookie } from 'hono/cookie'
import { sign } from 'hono/jwt'
import { z } from 'zod'

const app = new Hono().post(
  '/',
  zValidator(
    'json',
    z.object({
      usernameOrEmail: z
        .string()
        .min(1, { message: 'Username is required.' })
        .max(50),
      password: z.string().min(1, { message: 'Password is required.' })
    })
  ),
  async c => {
    const body = c.req.valid('json')

    // Use array destructuring to get the first item from the array of users
    // returned by the database query. This is because the query will always
    // return an array, even if there is only one user that matches the
    // search criteria. So, by using array destructuring, we can safely assume
    // that `user` will be either a user object or undefined.
    const [user] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.username, body.usernameOrEmail),
          eq(users.email, body.usernameOrEmail)
        )
      )

    if (!user) {
      return c.json({ error: 'Invalid username or password' }, 404)
    }

    const passwordMatched = await bcrypt.compare(body.password, user.password)

    if (!passwordMatched) {
      return c.json({ error: 'Invalid username or password' }, 401)
    }

    const payload = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      username: user.username,
      email: user.email,
      role: user.role
    }

    const sessionToken = await sign(payload, process.env.JWT_SECRET!, 'HS256')

    await setSignedCookie(
      c,
      'sessionToken',
      sessionToken,
      process.env.COOKIE_SECRET!,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        // maxAge: 60 * 60 * 24 * 30,
        maxAge: 60
      }
    )

    return c.json({ user: payload })
  }
)

export default app
