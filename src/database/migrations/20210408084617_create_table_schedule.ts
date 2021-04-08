import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('schedule_time', (table) => {
        table.increments('id').primary();
        table.string('Type').notNullable();
      
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('schedule_time');
}

