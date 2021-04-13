import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('comments', (table) => {
        table.increments('id').primary();
        table.text('text', 'TINYTEXT').notNullable();
        table.timestamp('_created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();

        //FK
        table
        .integer('suggestion_id')
        .notNullable()
        .references('id')
        .inTable('suggestions')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('comments');
}

