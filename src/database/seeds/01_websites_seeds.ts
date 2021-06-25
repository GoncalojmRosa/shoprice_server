import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("websites").del();

    // Inserts seed entries
    await knex("websites").insert([
        {
            "id": 1,
            "Name": "Continente",
            "url": "https://www.continente.pt/pesquisa/?q=",
            "XPath": "//*[@id=\"product-search-results\"]/div/div[2]/div[2]/div[1]/div/div",
            "ImgXPath": "//*[@id=\"product-search-results\"]/div/div[2]/div[2]/div[1]/div/div/div/div[1]/a/picture/img/@src",
            "NameXPath": "//*[@id=\"product-search-results\"]/div/div[2]/div[2]/div[1]/div/div/div/div[2]/div[1]/div/a",
            "PriceXPath": "//*[@id=\"product-search-results\"]/div/div[2]/div[2]/div[1]/div/div/div/div[2]/div[2]/div[1]/div/div[1]/span/span/span[1]"
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
            "XPath": "//*[@id=\"product-search-results\"]/div/div[2]/div[2]/div[1]/div/div",
            "ImgXPath": "//*[@id=\"product-search-results\"]/div/div[2]/div[2]/div[1]/div/div/div[1]/a/picture/img/@src",
            "NameXPath": "//*[@id=\"product-search-results\"]/div/div[2]/div[2]/div[1]/div/div/div[2]/div[2]/div/a",
            "PriceXPath": "//*[@id=\"product-search-results\"]/div/div[2]/div[2]/div[1]/div/div/div[2]/div[4]/div/span/span/span"
          },
          {
            "id": 4,
            "Name": "Global Data",
            "url": "https://www.globaldata.pt/?query=",
            "XPath": "/html/body/main/div[2]/ck-algolia-search/div[1]/div[2]/div[2]/div/div[1]/article",
            "ImgXPath": "/html/body/main/div[2]/ck-algolia-search/div[1]/div[2]/div[2]/div/div[1]/article/div[3]/div[1]/a/div/img/@src",
            "NameXPath": "/html/body/main/div[2]/ck-algolia-search/div[1]/div[2]/div[2]/div/div[1]/article/div[3]/div[2]/h6/a",
            "PriceXPath": "/html/body/main/div[2]/ck-algolia-search/div[1]/div[2]/div[2]/div/div[1]/article/div[3]/div[3]/span/span",
        },
        {
            "id": 5,
            "Name": "Mbit",
            "url": "https://www.mbit.pt/catalogsearch/result/index/?_=1623743111833&is_in_stock=1&q=",
            "XPath": "//*[@id=\"layer-product-list\"]/div/div[2]/ol/li[1]/div[2]",
            "ImgXPath": "//*[@id=\"layer-product-list\"]/div/div[2]/ol/li[1]/div[2]/div[1]/a/img/@src",
            "NameXPath": "//*[@id=\"layer-product-list\"]/div/div[2]/ol/li[1]/div[2]/div[2]/strong/a",
            "PriceXPath": "//*[@id=\"product-price-575140\"]/span",
        },
        {
            "id": 6,
            "Name": "Chip7",
            "url": "https://www.chip7.pt/?query=",
            "XPath": "//*[@id=\"search-hits\"]/div/div[1]",
            "ImgXPath": "//*[@id=\"search-hits\"]/div/div[1]/div/a/div[1]/img/@src",
            "NameXPath": "//*[@id=\"search-hits\"]/div/div[1]/div/a/div[2]/span",
            "PriceXPath": "//*[@id=\"search-hits\"]/div/div[1]/div/div/a/p[1]",
        }
    ]);
};
