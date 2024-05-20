import { db } from '@/drizzle/drizzle'
import { insertUsersSchema, users } from '@/drizzle/schema'
import { zValidator } from '@hono/zod-validator'
import { createId } from '@paralleldrive/cuid2'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const app = new Hono().post(
  '/',
  zValidator(
    'json',
    insertUsersSchema.pick({
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      password: true
    })
  ),
  async c => {
    const body = c.req.valid('json')

    const [usernameExists] = await db
      .select()
      .from(users)
      .where(eq(users.username, body.username))

    if (usernameExists) {
      // return c.json({ error: 'Username already exists' }, 409)
      // throw new HTTPException(409, {
      //   res: c.json({ error: 'Username already exists' }, 409)
      // })
      throw new HTTPException(409, { message: 'Username already exists' })
    }

    const [emailExists] = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email))

    if (emailExists) {
      // return c.json({ error: 'Email already exists' }, 409)
      // throw new HTTPException(409, {
      //   res: c.json({ error: 'Email already exists' }, 409)
      // })
      throw new HTTPException(409, { message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    await db.insert(users).values({
      id: createId(),
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      password: hashedPassword
    })

    return c.json({ data: 'Successfully signed up' }, 200)
  }
)

export default app
