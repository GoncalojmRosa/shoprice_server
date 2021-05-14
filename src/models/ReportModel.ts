import Knex from "knex"
import db from "../database/connections"

export async function updateReport(
    id: number,
    Title: string,
    Status: string,
    Summary: string,
    Priority: string,
    Tags: string,

    transaction?: Promise<Knex.Transaction<any, any>>,
  ) {
    // if (transaction) {
    //   return (await transaction)('users').select('*').where('id', id)
    // } else {
        // console.log("sadads")
      return await db.table('reports').update({Title: Title, Summary: Summary, Priority: Priority, Status: Status,Tags: Tags }).where({id: id});
    // }
  }