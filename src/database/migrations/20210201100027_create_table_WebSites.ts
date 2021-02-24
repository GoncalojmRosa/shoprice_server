import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('websites', (table) => {
        table.increments('id').primary();
        table.string('Name').notNullable();
        table.string('url').notNullable();
        table.string('XPath').notNullable();
        table.string('ImgXPath').notNullable();
        table.string('NameXPath').notNullable();
        table.string('PriceXPath').notNullable();
        table.string("filterCategory")
        table.string("secondUrl")
        table.string("secondFilterCategory")
        // table.string('pageElement').notNullable(); //div, ul, li, main, .....
        // table.string('pageElement_Class').notNullable(); //productBoxTop, .....
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('websites');
}

