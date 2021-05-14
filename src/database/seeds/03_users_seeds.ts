import * as Knex from "knex";
import { PasswordHash } from "../../security/passwordHash";
import * as bcrypt from "bcrypt";
const _helper = require('../../helpers/roles');
require("dotenv").config();

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10);

    // Inserts seed entries
    await knex("users").insert({
        "id": 1,
        "name": "Gonçalo Rosa",
        "email": process.env.EMAIL,
        "badge": "CEO",
        "isConfirmed": 1,
        "password": hashedPassword,
        "role": _helper.ADMIN
    });
};
