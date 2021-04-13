import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("schedule_time").del();

    // Inserts seed entries
    await knex("schedule_time").insert([
        {
            "id": 1,
            "Type": "Diariamente"
          },
          {
            "id": 2,
            "Type": "Semanalmente"
          },
          {
            "id": 3,
            "Type": "Mensalmente"
          }
    ]);
};
