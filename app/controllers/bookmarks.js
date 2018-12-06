const salonOps = require("../db/salon-operations");
const getUserBookmarksByUserId = salonOps.getUserBookmarksByUserId
const createUserBookmark =  salonOps.createUserBookmark
const deleteUserBookmark = salonOps.deleteUserBookmark;
const deleteAllUserBookmarksByUserId = salonOps.deleteAllUserBookmarksByUserId
const getBookmarks = async (ctx) => {

    let userId = ctx.query.userId;
    if(!userId){
        ctx.status = 422;
        ctx.message = "missing parameter"
        ctx.body = {};
        return;
    }

    const bookmarks = await getUserBookmarksByUserId(userId);
    console.log("getBookmarks")
    ctx.status = 200;
    ctx.body = bookmarks
}
const createBookmark = async(ctx) => {
    let userId = ctx.request.body.userId;
    let salonId = ctx.request.body.salonId;


    if(!userId || !salonId){
        ctx.status = 422;
        ctx.message = "missing parameter"
        ctx.body = {};
        return;
    }

    const bookmarks = await createUserBookmark(userId, salonId);
    console.log("createBook")
    ctx.status = 200;
    ctx.body = bookmarks

}

const deleteBookmark = async(ctx) => {
    let bookmarkId = ctx.params.bookmarkId;


    if(!bookmarkId){
        ctx.status = 422;
        ctx.message = "missing parameter"
        ctx.body = {};
        return;
    }

    const bookmarks = await deleteUserBookmark(parseInt(bookmarkId));
    console.log("deleteBookmark")
    ctx.status = 200;
    ctx.body = bookmarks

}
const clearAllBookmarks = async (ctx) => {
    let userId = ctx.params.userId;


    if(!userId){
        ctx.status = 422;
        ctx.message = "missing parameter"
        ctx.body = {};
        return;
    }

    const bookmarks = await deleteAllUserBookmarksByUserId(userId);
    console.log("clearBookmark")
    ctx.status = 200;
    ctx.body = bookmarks
}
module.exports = {
    getBookmarks,
    createBookmark,
    deleteBookmark,
    clearAllBookmarks
}