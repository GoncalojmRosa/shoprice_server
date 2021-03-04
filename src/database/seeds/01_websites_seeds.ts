import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("websites").del();

    // Inserts seed entries
    await knex("websites").insert([
        {
            "id": 1,
            "Name": "Continente",
            "url": "https://www.continente.pt/pt-pt/public/Pages/searchresults.aspx?k=",
            "XPath": "//*[@id=\"ctl00_SPWebPartManager1_g_ce8bbc4a_23de_48a0_afe2_1519cb58b783_ctl00__panelcontrol_\"]/div/div/div[4]/div[2]/div[2]/div[2]/div/div[1]",
            "ImgXPath": "//*[@id=\"ctl00_SPWebPartManager1_g_ce8bbc4a_23de_48a0_afe2_1519cb58b783_ctl00__panelcontrol_\"]/div/div/div[4]/div[2]/div[2]/div[2]/div/div[1]/div/div[1]/div[1]/div[1]/a/img/@data-original",
            "NameXPath": "//*[@id=\"ctl00_SPWebPartManager1_g_ce8bbc4a_23de_48a0_afe2_1519cb58b783_ctl00__panelcontrol_\"]/div/div/div[4]/div[2]/div[2]/div[2]/div/div[1]/div/div[1]/div[3]",
            "PriceXPath": "//*[@id=\"ctl00_SPWebPartManager1_g_ce8bbc4a_23de_48a0_afe2_1519cb58b783_ctl00__panelcontrol_\"]/div/div/div[4]/div[2]/div[2]/div[2]/div/div[1]/div/div[1]/div[4]/div[1]/div[1]"
          },
          {
            "id": 2,
            "Name": "Pingo Doce",
            "url": "https://mercadao.pt/store/pingo-doce/search?queries=",
            "XPath": "/html/body/pdo-root/main/pdo-page-container/ng-component/section/pdo-container/div/section/div/ng-component/pdo-product-grid/pdo-product-grid-layout/div/div[1]/pdo-product-item[1]/article",
            "ImgXPath": "/html/body/pdo-root/main/pdo-page-container/ng-component/section/pdo-container/div/section/div/ng-component/pdo-product-grid/pdo-product-grid-layout/div/div[1]/pdo-product-item[1]/article/a/picture/cl-image/img/@src",
            "NameXPath": "/html/body/pdo-root/main/pdo-page-container/ng-component/section/pdo-container/div/section/div/ng-component/pdo-product-grid/pdo-product-grid-layout/div/div[1]/pdo-product-item[1]/article/a/div/h3",
            "PriceXPath": "/html/body/pdo-root/main/pdo-page-container/ng-component/section/pdo-container/div/section/div/ng-component/pdo-product-grid/pdo-product-grid-layout/div/div[1]/pdo-product-item[1]/article/a/div/div/h4/pdo-product-price-tag/span",
            "filterCategory": "&filter=%7B%22from%22:0,%22categoryIds%22:%5B%",
            "secondUrl": "https://mercadao.pt/api/catalogues/5e8d7d0327783a0020f61e4d/products/search?query=",
            "secondFilterCategory": "%22%5D,%22sort%22:0,%22size%22:100,%22esPreference%22:0.8121348231377259%7D",
            "secondImgPath": "https://res.cloudinary.com/fonte-online/image/upload/c_fill,h_300,q_auto,w_300/v1/PDO_PROD/"
          },
          {
            "id": 3,
            "Name": "Auchan",
            "url": "https://www.auchan.pt/Frontoffice/search/",
            "XPath": "//*[@id=\"divDataList\"]/div[1]/div",
            "ImgXPath": "//*[@id=\"divDataList\"]/div[1]/div/div/div[1]/a/div/img/@src",
            "NameXPath": "//*[@id=\"divDataList\"]/div[1]/div/div/div[2]/div/a/h3",
            "PriceXPath": "//*[@id=\"divDataList\"]/div[1]/div/div/div[3]/div/p/span"
          }
    ]);
};
