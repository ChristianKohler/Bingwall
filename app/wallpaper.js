"use strict";

/*global app*/

(function(app){
  // Possible values : "1024x768" "1280x720" "1366x768" ("1920x1200")
  var resolutionHigh = "1920x1200";
  var resolution = "1366x768";
  var bingServiceUrl = "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-ww";

  function init(){
    setImageFromCache();
    get(bingServiceUrl)
    .then(parseToJson)
    .then(checkIfImageIsAlreadyInCache)
    .then(getCopyright)
    .then(getBackground)
    .then(cacheImage)
    .then(setImage);
  }

  function checkIfImageIsAlreadyInCache(data){
    return new Promise(function(resolve) {
      var url = getResolutionHighRes("http://www.bing.com" + data.images[0].url);
      var cachedImageURL = localStorage.getItem("wallpaper_url");

      if (url !== cachedImageURL) {
        resolve(data);
      }
    });
  }

  function parseToJson(result) {
    return new Promise(function(resolve) {
      resolve(JSON.parse(result.responseText));
    });
  }

  function getCopyright(data) {
    return new Promise(function(resolve) {
      setCopyright(data.images[0].copyright);
      localStorage.setItem("wallpaper_caption", data.images[0].copyright);
      resolve(data);
    });
  }

  function setCopyright(captionText) {
    var caption = document.querySelector("div.caption") || document.createElement("div");
    caption.className = "caption";
    caption.appendChild(document.createTextNode(captionText));
    document.getElementsByTagName("body")[0].appendChild(caption);
  }

  function getBackground(data) {
    return getBackgroundHighRes(data).then(function(result) {
      return result;
    }, function() {
      return getBackgroundDefault(data);
    });
  }

  function getBackgroundDefault(data) {
    var url = "http://www.bing.com" + data.images[0].url;
    return get(url, "blob");
  }

  function getBackgroundHighRes(data) {
    var url = getResolutionHighRes("http://www.bing.com" + data.images[0].url);
    return get(url, "blob").then(function(result){
      localStorage.setItem("wallpaper_url", url);
      return result;
    }, function(result){
      return result;
    });
  }

  function getResolutionHighRes(url) {
    return url.replace(resolution, resolutionHigh);
  }

  function setImage(imageBase64) {
    document.getElementsByTagName("html")[0].style.backgroundImage = "url(" + imageBase64 + ")";
  }

  function cacheImage(result) {
    return new Promise(function(resolve, reject) {
      try {
        var fileReader = new FileReader();
        fileReader.onload = function (evt) {
            var result = evt.target.result;

            try {
                localStorage.setItem("wallpaper", result);
                resolve(result);
            }
            catch (e) {
                reject(result);
            }
        };
        fileReader.readAsDataURL(result.response);
      }
      catch (e) {
          reject(result);
      }
    });
  }

  function setImageFromCache(result) {
    var cachedImage = localStorage.getItem("wallpaper");
    var cachedCaption = localStorage.getItem("wallpaper_caption");

    if (cachedImage) {
      setImage(cachedImage);
    }

    if (cachedCaption) {
      setCopyright(cachedCaption);
    }
  }

  function get(url, responseType) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open("GET", url);

      if (responseType) {
        req.responseType = responseType;
      }

      req.onload = function() {
        if (req.status === 200) {
          resolve(req);
        }
        else {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(Error("Network Error"));
      };

      req.send();
    });
  }

  app.registerControl(init);
})(app);
