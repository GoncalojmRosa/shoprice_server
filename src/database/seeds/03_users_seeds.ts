import * as Knex from "knex";
import * as bcrypt from "bcrypt";
import dotenv from "dotenv"
dotenv.config()

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.PASSWORD, salt);
    const password_demo = await bcrypt.hash(process.env.PASSWORD_DEMO, salt);

    // Inserts seed entries
    await knex("users").insert([{
        "id": 1,
        "name": "Gonçalo Rosa",
        "email": process.env.EMAIL,
        "badge": "CEO",
        "isConfirmed": 1,
        "password": hashedPassword,
        "role": process.env.ADMIN
    },{
        "id": 2,
        "name": "Shoprice Demo",
        "email": process.env.EMAIL_DEMO,
        "badge": "Active",
        "isConfirmed": 1,
        "password": password_demo,
        "role": process.env.DEMO
    }]);
};
