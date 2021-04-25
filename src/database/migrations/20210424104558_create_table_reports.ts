import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('reports', (table) => {
    table.increments('id').primary();   
    table.string('Title').notNullable();
    table.string('Status').defaultTo('Open');
    table.text('Summary').notNullable();
    table.string('Priority').defaultTo('Low');
    table.string('Tags').defaultTo('Bug, Customer');

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
export async function down(knex: Knex) {
  return knex.schema.dropTable('reports');
}
