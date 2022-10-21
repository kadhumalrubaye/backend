'use strict';
// console.log('cron is running');
import Parser from 'rss-parser';
import { Item, Output } from 'rss-parser';


import { YupValidationError } from '@strapi/utils/lib/errors';
// import { DownloadImage } from '../config/image_download'
import { RssSourceEntry } from './rss_srouce_entru';
import { ItemDto } from '../src/api/item/dto/itemDto';





export class FeedUpdater {




  // 2
  async getNewFeedItemsFrom(feedUrl: string): Promise<ItemDto[]> {
    let itemDto: ItemDto;

    let rss: Output<any>;
    let items: ItemDto[] = [];
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
      rss.items.forEach((item: Item) => {
        itemDto = new ItemDto();
        itemDto.title = item.title;
        itemDto.description = item.contentSnippet;
        itemDto.contetn = item.content;
        itemDto.author = item.creator;
        itemDto.link = item.link;
        itemDto.pubDate = item.pubDate;
        itemDto.thumbnail = (Array.isArray(item['media:content'])) ? item['media:content'][0]['$'].url : 'https://picsum.photos/500/200';
        // console.log( item.thumbnail);
        itemDto.source = rss.title;
        items.push(itemDto);
      });
    } catch (error) {
      console.error("Something went wrong in getNewFeedItemsFrom");
      console.error(error.message);
    }
    console.log('item in rss');

    console.log(items[0].title);

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
  async getNewFeedItems(): Promise<ItemDto[]> {
    let allNewFeedItems: ItemDto[] = [];
    try {
      const feeds: RssSourceEntry[] = await this.getFeedUrls();
      for (let i = 0; i < feeds.length; i++) {

        if (feeds[i].active) {
          let feedItems: ItemDto[] = await this.getNewFeedItemsFrom(feeds[i].link);
          allNewFeedItems = [...allNewFeedItems, ...feedItems];
        }
      }
    } catch (error) {
      console.log('error in getNewFeedItems');
      console.log(error);

    }
    // console.log(allNewFeedItems);

    return allNewFeedItems;
  }
  private async createItem() {
    const feedItems: ItemDto[] = await this.getNewFeedItems();

    for (let i = 0; i < feedItems.length; i++) {
      const item: ItemDto = feedItems[i];

      try {


        const newsItem = await strapi.entityService.create(
          'api::item.item', {

          data: {
            title: item.title || 'not title',
            description: item.description ?? "no description",
            pubDate: item.pubDate ?? Date.now.toString,
            link: item.link ?? 'no link',
            author: item.author ?? 'unkown',
            content: item.contetn ?? 'no content',
            thumbnail: item.thumbnail ?? 'no link',
            source: item.source ?? 'no source'
          }
        });

        console.log('item saved');

        console.log(newsItem);
      }

      catch (error) {
        if (error instanceof YupValidationError) {
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
// 6

