'use strict';

import { FeedUpdater } from './feedUpdater'


export async function updateFeed() {
  const feedUpdater: FeedUpdater = new FeedUpdater();

  return await feedUpdater.main();

}


export default {
  updateFeed,

};