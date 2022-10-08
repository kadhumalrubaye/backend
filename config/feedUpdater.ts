'use strict';
// console.log('cron is running');
import Parser from 'rss-parser';
import { Item, Output } from 'rss-parser';


import { YupValidationError } from '@strapi/utils/lib/errors';
import { DownloadImage } from '../config/image_download'
import { RssSourceEntry } from './rss_srouce_entru';
import { ItemDto } from '../src/api/item/dto/itemDto';



let itemDto: ItemDto = new ItemDto()

export class FeedUpdater {


  // 2
  async getNewFeedItemsFrom(feedUrl: string): Promise<Item[]> {


    let rss: Output<any>;

    let items: Item[] = [];

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
    } catch (error) {
      console.error("Something went wrong in getNewFeedItemsFrom");
      console.error(error.message);
    }
    return items;
  }

  // 3
  async getFeedUrls(): Promise<RssSourceEntry[]> {

    // console.log('get feed urls');
    let entry: RssSourceEntry[];
    try {
      entry = await strapi.entityService.findMany('api::rss-source.rss-source', {


      });


    } catch (error) {
      console.error("Something went wrong in getFeedUrls");
      console.error(error);
    }
    return entry;
  }

  // 4
  async getNewFeedItems(): Promise<Item[]> {
    let allNewFeedItems: Item[] = [];
    const feeds: RssSourceEntry[] = await this.getFeedUrls();
    for (let i = 0; i < feeds.length; i++) {
      const {
        active,
        link
      } = feeds[i];
      if (active) {
        let feedItems: Item[] = await this.getNewFeedItemsFrom(link);
        allNewFeedItems = [...allNewFeedItems, ...feedItems];
      }
    }
    return allNewFeedItems;
  }

  // 5
  async main() {

    const feedItems: Item[] = await this.getNewFeedItems();

    for (let i = 0; i < feedItems.length; i++) {
      const item: any = feedItems[i];
      try {

        const newsItem = await strapi.entityService.create(
          'api::item.item', {
          data: {
            title: item.title || 'not title',
            description: item.contentSnippet ?? "no description",
            pubDate: item.pubDate,
            link: item.link,
            author: item.creator ?? 'unkown',
            content: item.content ?? 'no content',
            thumbnail: item.thumbnail,
            source: item.soruce


          }


        });
        console.log(newsItem);
      } catch (error) {



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
// 6

