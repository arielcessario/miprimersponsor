(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.main', ['ngRoute'])
        .controller('MainController', MainController);


    MainController.$inject = ['UserService', 'DonationService', 'ProyectService', '$location'];
    function MainController(UserService, DonationService, ProyectService, $location) {

        var vm = this;
        vm.proyectos = [];
        vm.proyecto = {};

        vm.goToDetalle = goToDetalle;

        ProyectService.get(function (data) {
            vm.proyectos = data;
        });

        function goToDetalle(id) {

            $location.path('/proyecto/' + id);
        }


    }
})();