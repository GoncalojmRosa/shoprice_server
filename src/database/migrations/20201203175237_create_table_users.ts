import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('avatar').defaultTo("www.minervastrategies.com/wp-content/uploads/2016/03/default-avatar.jpg");
        table.string('badge').defaultTo("Active"); // (Admin, Banned, Editor, NormalUser, ....)
        table.string('password').notNullable(); // (Admin, Banned, Editor, NormalUser, ....)
        table.boolean('isConfirmed').defaultTo(false); 
        table.string('emailToken'); 
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}

