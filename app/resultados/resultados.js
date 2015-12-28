(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.resultados', ['ngRoute', ['administracion/administracion.min.js']])
        .controller('ResultadoController', ResultadoController);


    ResultadoController.$inject = ['UserService', 'DonationService', 'ProyectService', '$location', 'AdministracionService',
        '$interval', '$routeParams'];
    function ResultadoController(UserService, DonationService, ProyectService, $location, AdministracionService,
                                 $interval, $routeParams) {


        var vm = this;
        vm.proyectos = [];
        vm.type = $routeParams.type;
        vm.value = $routeParams.value;



        // FUNCTIONS

        // INIT

        // Obtengo los proyectos
        if (vm.type == 'c') {
            ProyectService.get(function (data) {
                ProyectService.getByParams('categoria_id', vm.value, 'true', function (data) {

                    vm.proyectos = data;
                });


            });
        } else {
            ProyectService.get(function (data) {
                ProyectService.getByParams('nombre', vm.value, 'false', function (data) {

                    vm.proyectos = data;
                });


            });
        }

    }
})();