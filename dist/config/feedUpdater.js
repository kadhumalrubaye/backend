'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
// console.log('cron is running');
const rss_parser_1 = __importDefault(require("rss-parser"));
// 2
async function getNewFeedItemsFrom(feedUrl) {
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
            item.pubDate = Date.parse(item.pubDate);
            item.thumbnail = (Array.isArray(item['media:content'])) ? item['media:content'][0]['$'].url : 'https://picsum.photos/500/200';
            // console.log( item.thumbnail);
            item.soruce = rss.title;
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
async function getFeedUrls() {
    // console.log('get feed urls');
    let entry;
    try {
        entry = await strapi.entityService.findMany('api::rss-source.rss-source', {
        // active: true
        });
    }
    catch (error) {
        console.error("Something went wrong in getFeedUrls");
        console.error(error);
    }
    return entry;
}
async function bingNewsItemWithGovernrate() {
    //parse the news to look for governrate name
    // assign|bind the news to the governrate
}
// 4
async function getNewFeedItems() {
    let allNewFeedItems = [];
    const feeds = await getFeedUrls();
    //   console.log('feeds are ');
    for (let i = 0; i < feeds.length; i++) {
        const { link } = feeds[i];
        const feedItems = await getNewFeedItemsFrom(link);
        // console.info(feedItems[0].title);
        allNewFeedItems = [...allNewFeedItems, ...feedItems];
    }
    return allNewFeedItems;
}
// 5
async function main() {
    var _a, _b, _c, _d, _e;
    const feedItems = await getNewFeedItems();
    let comments;
    let likes;
    let governrate;
    let newsCats;
    // try {
    //   await strapi.db.query('api::news-item.news-item').deleteMany();
    //   // comments = await strapi.db.query('api::comment.comment').findOne();
    //   // // comments = await strapi.entityService.findOne('api::comment.comment').findMany();
    //   // likes = await strapi.db.query('api::like.like').findOne();
    //   // itemNews = await strapi.db.query('pi::news-item.news-item').findOne();
    //   // governrate = await strapi.db.query('api::governorate.governorate').findOne();
    //   // newsCats = await strapi.db.query('api::news-cat.news-cat').findOne();
    //   // const usres = await strapi.db.query('plugin::users-permissions.user').findOne();
    //   // console.log([comments, likes, governrate, newsCats, usres,]);
    // } catch (error) {
    //   console.error("Something went wrong in delete many");
    //   console.error(error);
    // }
    for (let i = 0; i < feedItems.length; i++) {
        const item = feedItems[i];
        try {
            // const comment = await strapi.entityService.create(
            //   'api::comment.comment',
            //   {
            //     data: {
            //       content: "لا يوجد تعليق",
            //     }
            //   }
            // );
            // console.log(comment);
            const newsItem = await strapi.entityService.create('api::item.item', {
                data: {
                    title: item.title || 'not title',
                    description: (_b = (_a = item.contentSnippet) !== null && _a !== void 0 ? _a : item.preview) !== null && _b !== void 0 ? _b : "no description",
                    pubDate: item.pubDate,
                    link: item.link,
                    author: (_c = item.creator) !== null && _c !== void 0 ? _c : 'unkown',
                    content: (_e = (_d = item.content) !== null && _d !== void 0 ? _d : item.description) !== null && _e !== void 0 ? _e : 'no content',
                    thumbnail: item.thumbnail,
                    source: item.soruce,
                    // news_cats: newsCats,
                }
            });
            console.log(newsItem.title);
        }
        catch (error) {
            // console.error("Something went wrong in create");
            // if (error instanceof YupValidationError)
            //   console.error(error.message);
            // else console.log(error.message);
        }
    }
}
exports.main = main;
function urlPars(the_url) {
    const url = the_url;
    const urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);
    const hostname = urlParts[1]; // www.example.com
    // console.log(hostname);
    return hostname;
}
// 6
exports.default = {
    main,
};
