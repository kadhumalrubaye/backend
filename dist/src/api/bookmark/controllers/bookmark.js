"use strict";
/**
 *  bookmark controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::bookmark.bookmark', {
    // async create(ctx) {
    //     // ctx.state.user = await strapi.query('user', 'users-permissions').findOne({ _id, id });
    //     console.log(ctx.request.body);
    //     // const data = ctx.request.body
    //     const { items } = ctx.request.body.data
    //     // console.log(ctx.state.user);
    //     const { id } = ctx.state.user;
    //     console.log(id);
    //     ctx.request.body = { "data": { items, id } };
    //     // console.log(ctx.request.body);
    //     const response = await super.create(ctx);
    //     // some more logic
    //     return response;
    // },
    async getCurrentUserBookmarkItems(ctx) {
        const currentUserId = ctx.state.user.id;
        try {
            const entries = await strapi.db.query('api::bookmark.bookmark').findOne({
                populate: ["items"],
                where: { user: currentUserId },
            });
            return entries;
        }
        catch (error) {
            return { error };
        }
    },
    async updateBookmarkItems(ctx) {
        const currentUserId = ctx.state.user.id;
        const { id } = ctx.request.params;
        console.log(id);
        const { data } = ctx.request.body;
        console.log(ctx.request.body);
        const { items } = data;
        const newItesm = items;
        console.log(newItesm);
        //[11,34]
        try {
            const bookmarkItems = await strapi.db.query('api::bookmark.bookmark').findOne({
                populate: ["items"],
                where: { id: id },
            });
            console.log('bookmars items');
            console.log(bookmarkItems.items);
            //items+meta data
            const entry = await strapi.db.query('api::bookmark.bookmark').update({
                where: { id: id },
                data: {
                    items: [...bookmarkItems.items, ...newItesm],
                },
                sort: { items: 'desc' },
            });
            console.log(entry);
            return entry;
        }
        catch (error) {
            console.log(error);
            return { error };
        }
    },
});
