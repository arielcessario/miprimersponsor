(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.conozcanos', [])
        .controller('ConozcanosController', ConozcanosController);


    ConozcanosController.$inject = [];
    function ConozcanosController() {
        var vm = this;
    }
})();