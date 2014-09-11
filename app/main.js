"use strict";

var app = (function(){
  var controlInitializer = [];

  function init(){
    controlInitializer.forEach(function (initFunc) {
      initFunc();
    });
  }

  function registerControl(handler) {
    controlInitializer.push(handler);
  }

  return {
    init: init,
    registerControl: registerControl
  };
})();
