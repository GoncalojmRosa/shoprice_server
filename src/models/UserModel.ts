import Knex from "knex"
import db from "../database/connections"

export interface UserInterface {
    isConfirmed?: boolean
    emailToken?: string
    _created_at: string
    id?: number
    name?: string
    avatar?: string
    badge?: string
    email?: string
    password?: string
  }

export async function indexUser(
    id: string | number,
    transaction?: Promise<Knex.Transaction<any, any>>,
  ) {
    if (transaction) {
      return (await transaction)('users').select('*').where('id', id)
    } else {
      return db.table('users').select('*').where('id', id)
    }
  }