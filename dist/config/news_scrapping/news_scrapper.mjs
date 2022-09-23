"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
// Get the data
const targetUrl = "https://www.alsharqiya.com/ar";
const pageResponse = await axios_1.default.get(targetUrl);
const $ = (0, cheerio_1.load)(pageResponse.data);
$("div.article.latest-news--js").each((_, el) => {
    $(el).each((_, el) => {
        let news_items;
        news_items = el;
        console.log(news_items.attributes[0].value);
    });
});
