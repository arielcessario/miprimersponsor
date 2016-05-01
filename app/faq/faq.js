(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.faq', [])
        .controller('FaqController', FaqController);


    FaqController.$inject = [];
    function FaqController() {
        var vm = this;
    }
})();