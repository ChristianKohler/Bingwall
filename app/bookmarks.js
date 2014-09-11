"use strict";

/*global app*/

(function(app){
  function renderBookmark(bookmark){
    console.log(bookmark);
  }

  function replaceTitleWithUrlIfEmpty(bookmark) {
    if (bookmark.title === "") {
      bookmark.title = bookmark.url;
    }

    return bookmark;
  }

  function displayBookmarkBar(tree){
    var bookmarks = tree[0].children;
    bookmarks = bookmarks.map(replaceTitleWithUrlIfEmpty);
    var bookmarkBarTemplateSource   = document.getElementById("template-bookmarkbar").text;
    var bookmarkBarTemplate = Handlebars.compile(bookmarkBarTemplateSource);
    var bookmarkBarHtml = bookmarkBarTemplate({bookmarks: bookmarks});

    var body = document.getElementsByTagName("body")[0];
    body.innerHTML += bookmarkBarHtml;

    var bookmarks = tree[0].children;
    bookmarks.forEach(renderBookmark);
  }

  function init(){
    chrome.bookmarks.getSubTree("1", displayBookmarkBar);
  }

  app.registerControl(init);
})(app);
