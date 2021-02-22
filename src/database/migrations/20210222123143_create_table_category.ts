import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('categories', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('queryString').notNullable();

        //FK
        table
        .integer('website_id')
        .notNullable()
        .references('id')
        .inTable('websites')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('categories');
}

