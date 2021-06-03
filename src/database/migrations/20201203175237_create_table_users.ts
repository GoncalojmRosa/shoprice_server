import * as Knex from "knex";

const role = {
    ADMIN: "admin",
    BASIC: "basic"
}

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('avatar').defaultTo("https://www.minervastrategies.com/wp-content/uploads/2016/03/default-avatar.jpg");
        table.string('badge').defaultTo("Active"); // (Admin, Banned, Editor, NormalUser, ....)
        table.string('password').notNullable(); // (Admin, Banned, Editor, NormalUser, ....)
        table.boolean('isConfirmed').defaultTo(false); 
        table.string('emailToken'); 
        table.timestamp('_created_at').defaultTo(knex.fn.now())
        table.integer('warnings').defaultTo(0)
        table.string('role').defaultTo(role.BASIC)
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}

