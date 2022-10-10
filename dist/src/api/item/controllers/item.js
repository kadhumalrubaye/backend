'use strict';
const { ItemDto } = require('../dto/itemDto');
const item = require('../routes/item');
/**
 * item controller
 */
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::item.item', {
    async breakingNews(ctx) {
        let itemAttrs = {};
        try {
            const items = await strapi.db.query('api::item.item').findMany({
                where: { urgent: true },
            });
            items.map(item => item.attributes = { ...item });
            console.log(items);
            return items;
        }
        catch (error) {
            console.log(error);
            return { error };
        }
    }
});
