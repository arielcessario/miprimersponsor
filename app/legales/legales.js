(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.legales', [])
        .controller('LegalesController', LegalesController);


    LegalesController.$inject = [];
    function LegalesController() {
        var vm = this;

    }
})();