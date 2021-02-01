import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('websites', (table) => {
        table.increments('id').primary();
        table.string('url').notNullable(); 
        table.string('pageElement').notNullable(); //div, ul, li, main, .....
        table.string('pageElement_Class').notNullable(); //productBoxTop, .....
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('websites');
}

