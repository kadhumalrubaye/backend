import { updateFeed } from './tasks'

export default {
  // 1
  '3 * * * *': {
    // 2
    task: async () => {
      // await strapi.config.tasks.updateTweets();
      await updateFeed();
    },
    // 3
    options: {
      tz: 'Asia/Kolkata',
    },
  },
};