'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeed = void 0;
const feedUpdater_1 = require("./feedUpdater");
async function updateFeed() {
    const feedUpdater = new feedUpdater_1.FeedUpdater();
    return await feedUpdater.main();
}
exports.updateFeed = updateFeed;
exports.default = {
    updateFeed,
};
