'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeed = void 0;
const feedUpdater_1 = require("./feedUpdater");
async function updateFeed() {
    return await (0, feedUpdater_1.main)();
}
exports.updateFeed = updateFeed;
exports.default = {
    updateFeed,
};
