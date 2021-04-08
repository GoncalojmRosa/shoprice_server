import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('newsLetter', (table) => {
        table.increments('id').primary();
        table.string('ProductName').notNullable();
        table.integer('Price');
        table.timestamp('_created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
        table.timestamp('_next_email').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
        table.timestamp('_sended_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
        //FK
        table
        .integer('website_id')
        .notNullable()
        .references('id')
        .inTable('websites')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        table
        .integer('schedule_id')
        .notNullable()
        .references('id')
        .inTable('schedule_time')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('newsLetter');
}


