'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedUpdater = void 0;
// console.log('cron is running');
const rss_parser_1 = __importDefault(require("rss-parser"));
require("./text_analysis");
const errors_1 = require("@strapi/utils/lib/errors");
const itemDto_1 = require("../src/api/item/dto/itemDto");
const text_analysis_1 = require("./text_analysis");
class FeedUpdater {
    constructor() {
        this.textAnalysis = new text_analysis_1.TextAnalyzer();
    }
    // 2
    async getNewFeedItemsFromRss(feedUrl) {
        let itemDto;
        let items = [];
        let rss;
        try {
            const parser = new rss_parser_1.default({
                // timeout: 1000,
                customFields: {
                    item: [
                        ['media:content', 'media:content', {
                                keepArray: true
                            }],
                    ],
                }
            });
            rss = await parser.parseURL(feedUrl);
            rss.items.forEach(async (item) => {
                itemDto = new itemDto_1.ItemDto();
                itemDto.title = item.title;
                itemDto.description = item.contentSnippet;
                itemDto.contetn = item.content;
                itemDto.author = item.creator;
                itemDto.link = item.link;
                itemDto.pubDate = item.pubDate;
                itemDto.thumbnail = (Array.isArray(item['media:content'])) ? item['media:content'][0]['$'].url : 'https://picsum.photos/500/200';
                itemDto.source = rss.title;
                //clean text
                // itemDto.title = await this.textAnalysis.cleanText(itemDto.title);
                // itemDto.description = await this.textAnalysis.cleanText(itemDto.description);
                // itemDto.contetn = await this.textAnalysis.cleanText(itemDto.contetn);
                // console.log(itemDto);
                items.push(itemDto);
            });
        }
        catch (error) {
            console.error("Something went wrong in getNewFeedItemsFromRss");
            console.error(error.message);
        }
        console.log('item in rss');
        console.log(items.length);
        return items;
    }
    // 3
    async getFeedUrls() {
        // console.log('get feed urls');
        let entry;
        try {
            entry = await strapi.entityService.findMany('api::rss-source.rss-source', {
                where: { active: true }
            });
        }
        catch (error) {
            console.error("Something went wrong in getFeedUrls");
            console.error(error);
        }
        return entry;
    }
    // 4
    async getNewFeedItems() {
        let allNewFeedItems = [];
        try {
            const feeds = await this.getFeedUrls();
            for (let i = 0; i < feeds.length; i++) {
                console.log(feeds[i].name);
                if (feeds[i].active) {
                    let feedItems = await this.getNewFeedItemsFromRss(feeds[i].link);
                    allNewFeedItems = [...allNewFeedItems, ...feedItems];
                }
            }
        }
        catch (error) {
            console.log('error in getNewFeedItems');
            console.log(error);
        }
        return allNewFeedItems;
    }
    async createItem() {
        var _a, _b, _c, _d, _e, _f, _g;
        const feedItems = await this.getNewFeedItems();
        for (let i = 0; i < feedItems.length; i++) {
            const item = feedItems[i];
            const cats = await this.textAnalysis.addItemToUrgentCategory(item);
            try {
                const newsItem = await strapi.entityService.create('api::item.item', {
                    data: {
                        title: item.title || 'not title',
                        description: (_a = item.description) !== null && _a !== void 0 ? _a : "no description",
                        pubDate: (_b = item.pubDate) !== null && _b !== void 0 ? _b : Date.now.toString,
                        link: (_c = item.link) !== null && _c !== void 0 ? _c : 'no link',
                        author: (_d = item.author) !== null && _d !== void 0 ? _d : 'unkown',
                        content: (_e = item.contetn) !== null && _e !== void 0 ? _e : 'no content',
                        thumbnail: (_f = item.thumbnail) !== null && _f !== void 0 ? _f : 'no link',
                        source: (_g = item.source) !== null && _g !== void 0 ? _g : 'no source',
                        categories: cats,
                    }
                });
                console.log('item saved');
            }
            catch (error) {
                if (error instanceof errors_1.YupValidationError) {
                    console.log('YupValidationError ');
                }
                console.log('error in item create');
                console.log(error.message);
            }
        }
    }
    // 5
    async main() {
        console.log('main start');
        await this.createItem();
    }
    urlPars(the_url) {
        const url = the_url;
        const urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);
        const hostname = urlParts[1]; // www.example.com
        // console.log(hostname);
        return hostname;
    }
}
exports.FeedUpdater = FeedUpdater;
