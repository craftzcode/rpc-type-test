// import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

export const userRole = pgEnum('userRole', ['ADMIN', 'USER'])

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  password: text('password').notNull(),
  role: userRole('user_role').default('USER').notNull(),
  plaidId: text('plaid_id'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow()
})

export const insertUsersSchema = createInsertSchema(users)

// export const sessions = pgTable('sessions', {
//   sessionToken: text('session_token').primaryKey(),
//   userId: uuid('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   expires: timestamp('expires', { mode: 'date' }).notNull()
// })

// //! RELATIONS
// export const usersRelations = relations(users, ({ many }) => {
//   return {
//     sessions: many(sessions)
//   }
// })

// export const sessionsRelations = relations(sessions, ({ one }) => {
//   return {
//     user: one(users, {
//       fields: [sessions.userId],
//       references: [users.id]
//     })
//   }
// })
