import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("categories").del();

    // Inserts seed entries
    await knex("categories").insert([
        {
            "id": 1,
            "name": "Mercearia",
            "queryString": "%3Arelevance%3Acategory%3AWEB.004.000.00000",
            "website_id": 1
          },
          {
            "id": 2,
            "name": "Mercearia",
            "queryString": "225e8d7d15a84afd001e6e36c1",
            "website_id": 2
          },
          {
            "id": 3,
            "name": "Mercearia",
            "queryString": "#?ps=30&st=4&sd=1&ref=04@04%7C01",
            "website_id": 3
          },
          {
            "id": 4,
            "name": "Legumes",
            "queryString": "%3Arelevance%3Acategory%3AWEB.001.002.00000",
            "website_id": 1
          },
          {
            "id": 5,
            "name": "Legumes",
            "queryString": "225e8d7d16a84afd001e6e36e3",
            "website_id": 2
          },
          {
            "id": 6,
            "name": "Legumes",
            "queryString": "#?ps=30&st=4&sd=1&ref=03@03%7C08",
            "website_id": 3
          },
          {
            "id": 7,
            "name": "Bebidas",
            "queryString": "%3Arelevance%3Acategory%3AWEB.007.003.00000",
            "website_id": 1
          },
          {
            "id": 8,
            "name": "Bebidas",
            "queryString": "225e8d7d1ba84afd001e6e3782",
            "website_id": 2
          },
          {
            "id": 9,
            "name": "Bebidas",
            "queryString": "#?ps=30&st=4&sd=1&ref=05",
            "website_id": 3
          },
          {
            "id": 10,
            "name": "Talho",
            "queryString": "%3Arelevance%3Acategory%3AWEB.001.003.00000",
            "website_id": 1
          },
          {
            "id": 11,
            "name": "Talho",
            "queryString": "225e8d7d16a84afd001e6e36ea",
            "website_id": 2
          },
          {
            "id": 12,
            "name": "Talho",
            "queryString": "#?ps=30&st=4&sd=1&ref=03%7C04",
            "website_id": 3
          },
          {
            "id": 13,
            "name": "Peixe",
            "queryString": "%3Arelevance%3Acategory%3AWEB.001.003.00000",
            "website_id": 1
          },
          {
            "id": 14,
            "name": "Peixe",
            "queryString": "225e8d7d18a84afd001e6e372f",
            "website_id": 2
          },
          {
            "id": 15,
            "name": "Peixe",
            "queryString": "#?ps=30&st=3&sd=0&ref=06%7C03",
            "website_id": 3
          },
          {
            "id": 16,
            "name": "Frutas",
            "queryString": "%3Arelevance%3Acategory%3AWEB.001.001.00000",
            "website_id": 1
          },
          {
            "id": 17,
            "name": "Frutas",
            "queryString": "225e8d7d16a84afd001e6e36e4",
            "website_id": 2
          },
          {
            "id": 18,
            "name": "Frutas",
            "queryString": "#?ps=30&st=4&sd=1&ref=03@03%7C01",
            "website_id": 3
          },
          {
            "id": 19,
            "name": "Temperos",
            "queryString": "%3Arelevance%3Acategory%3AWEB.003.004.00000",
            "website_id": 1
          },
          {
            "id": 20,
            "name": "Temperos",
            "queryString": "225e8d7d15a84afd001e6e36d4",
            "website_id": 2
          },
          {
            "id": 21,
            "name": "Temperos",
            "queryString": "#?ps=30&st=3&sd=0&ref=04%7C05",
            "website_id": 3
          },
          {
            "id": 22,
            "name": "Higiene",
            "queryString": "%3Arelevance%3Acategory%3AWEB.009.001.00000",
            "website_id": 1
          },
          {
            "id": 23,
            "name": "Higiene",
            "queryString": "225e8d7d1ca84afd001e6e379e",
            "website_id": 2
          },
          {
            "id": 24,
            "name": "Higiene",
            "queryString": "#?ps=30&st=0&sd=0&ref=10",
            "website_id": 3
          },
          {
            "id": 25,
            "name": "Higiene Oral",
            "queryString": "%3Arelevance%3Acategory%3AWEB.009.003.00000",
            "website_id": 1
          },
          {
            "id": 26,
            "name": "Higiene Oral",
            "queryString": "225e8d7d1ca84afd001e6e379e",
            "website_id": 2
          },
          {
            "id": 27,
            "name": "Higiene Oral",
            "queryString": "#?ps=30&st=4&sd=1&ref=10%7C05",
            "website_id": 3
          },
          {
            "id": 28,
            "name": "Infantil",
            "queryString": "%3Arelevance%3Acategory%3AWEB.009.003.00000",
            "website_id": 1
          },
          {
            "id": 29,
            "name": "Infantil",
            "queryString": "225e8d7d1ca84afd001e6e379a",
            "website_id": 2
          },
          {
            "id": 30,
            "name": "Infantil",
            "queryString": "#?ps=30&st=0&sd=0&ref=10@10%7C02%7C08",
            "website_id": 3
          },
          {
            "id": 31,
            "name": "Cabelo",
            "queryString": "%3Arelevance%3Acategory%3AWEB.009.002.00000",
            "website_id": 1
          },
          {
            "id": 32,
            "name": "Cabelo",
            "queryString": "225ff502b6f97b12004184f510",
            "website_id": 2
          },
          {
            "id": 33,
            "name": "Cabelo",
            "queryString": "#?ps=30&st=4&sd=1&ref=10@10%7C02%7C01",
            "website_id": 3
          }
    ]);
};
