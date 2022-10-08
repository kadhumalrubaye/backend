'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedUpdater = void 0;
// console.log('cron is running');
const rss_parser_1 = __importDefault(require("rss-parser"));
const itemDto_1 = require("../src/api/item/dto/itemDto");
let itemDto = new itemDto_1.ItemDto();
class FeedUpdater {
    // 2
    async getNewFeedItemsFrom(feedUrl) {
        let rss;
        let items = [];
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
        try {
            rss = await parser.parseURL(feedUrl);
            rss.items.forEach((item) => {
                itemDto.title = item.title;
                itemDto.description = item.description;
                itemDto.contetn = item.contetn;
                itemDto.author = item.author;
                itemDto.link = item.link;
                itemDto.pubDate = item.pubDate;
                itemDto.thumbnail = (Array.isArray(item['media:content'])) ? item['media:content'][0]['$'].url : 'https://picsum.photos/500/200';
                // console.log( item.thumbnail);
                itemDto.source = rss.title;
                items.push(item);
            });
        }
        catch (error) {
            console.error("Something went wrong in getNewFeedItemsFrom");
            console.error(error.message);
        }
        return items;
    }
    // 3
    async getFeedUrls() {
        // console.log('get feed urls');
        let entry;
        try {
            entry = await strapi.entityService.findMany('api::rss-source.rss-source', {});
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
        const feeds = await this.getFeedUrls();
        for (let i = 0; i < feeds.length; i++) {
            const { active, link } = feeds[i];
            if (active) {
                let feedItems = await this.getNewFeedItemsFrom(link);
                allNewFeedItems = [...allNewFeedItems, ...feedItems];
            }
        }
        return allNewFeedItems;
    }
    // 5
    async main() {
        var _a, _b, _c;
        const feedItems = await this.getNewFeedItems();
        for (let i = 0; i < feedItems.length; i++) {
            const item = feedItems[i];
            try {
                const newsItem = await strapi.entityService.create('api::item.item', {
                    data: {
                        title: item.title || 'not title',
                        description: (_a = item.contentSnippet) !== null && _a !== void 0 ? _a : "no description",
                        pubDate: item.pubDate,
                        link: item.link,
                        author: (_b = item.creator) !== null && _b !== void 0 ? _b : 'unkown',
                        content: (_c = item.content) !== null && _c !== void 0 ? _c : 'no content',
                        thumbnail: item.thumbnail,
                        source: item.soruce
                    }
                });
                console.log(newsItem);
            }
            catch (error) {
            }
        }
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
