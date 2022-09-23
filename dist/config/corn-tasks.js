"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("./tasks");
exports.default = {
    // 1
    '3 * * * *': {
        // 2
        task: async () => {
            // await strapi.config.tasks.updateTweets();
            await (0, tasks_1.updateFeed)();
        },
        // 3
        options: {
            tz: 'Asia/Kolkata',
        },
    },
};
