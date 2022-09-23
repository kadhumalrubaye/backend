'use strict';
// console.log('cron is running');
import Parser from 'rss-parser';


import { YupValidationError } from '@strapi/utils/lib/errors';

import { Strapi } from '@strapi/strapi';
import { ItemDto } from './../src/api/item/dto/item'





// 2
async function getNewFeedItemsFrom(feedUrl: string) {


  let rss;
  let items = [];
  const parser = new Parser({
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
      console.log(item.title);
      items.push(item);
    });
  } catch (error) {
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

  } catch (error) {
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
    const {
      link
    } = feeds[i];
    const feedItems = await getNewFeedItemsFrom(link);
    // console.info(feedItems[0].title);
    allNewFeedItems = [...allNewFeedItems, ...feedItems];
  }

  return allNewFeedItems;
}

// 5
export async function main() {

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
      const newsItem = await strapi.entityService.create(
        'api::item.item', {
        data: {
          title: item.title || 'not title',
          description: item.contentSnippet ?? item.preview ?? "no description",
          pubDate: item.pubDate,
          link: item.link,
          author: item.creator ?? 'unkown',
          content: item.content ?? item.description ?? 'no content',
          thumbnail: item.thumbnail,
          source: item.soruce,
          // news_cats: newsCats,


        }


      });
      console.log(newsItem.title);
    } catch (error) {
      console.error("Something went wrong in create");


      if (error instanceof YupValidationError)
        console.error(error.message);
      else console.log(error.message);


    }
  }
}

function urlPars(the_url) {
  const url = the_url;
  const urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);
  const hostname = urlParts[1]; // www.example.com
  // console.log(hostname);
  return hostname;
}
// 6
export default {
  main,
};
