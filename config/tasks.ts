'use strict';

import { main } from './feedUpdater'


export async function updateFeed() {

  return await main();

}


export default {
  updateFeed,

};