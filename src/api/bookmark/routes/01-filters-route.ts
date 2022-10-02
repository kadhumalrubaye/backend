export default {
    routes: [
        {
            method: "GET",
            path: "/bookmarks/getCurrentUserBookmarkItems",
            handler: "bookmark.getCurrentUserBookmarkItems"
        },
        {
            method: "PUT",
            path: "/bookmarks/updateBookmarkItems/:id",
            handler: "bookmark.updateBookmarkItems"
        }
    ]
}