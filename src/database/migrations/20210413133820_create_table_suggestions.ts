import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('suggestions', (table) => {
        table.increments('id').primary();
        table.text('text', 'TINYTEXT').notNullable();
        table.integer('likes').defaultTo(0); // times CLICKED
        table.integer('views').defaultTo(0); // times CLICKED
        table.integer('comments').defaultTo(0); // times CLICKED
        table.integer('shares').defaultTo(0); // times CLICKED
        table.timestamp('_created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();

        //FK
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
    return knex.schema.dropTable('suggestions');
}

