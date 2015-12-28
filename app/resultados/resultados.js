(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.resultados', ['ngRoute', ['administracion/administracion.min.js']])
        .controller('ResultadoController', ResultadoController);


    ResultadoController.$inject = ['AppService', 'DonationService', 'ProyectService', '$location', 'AdministracionService',
        '$interval', '$routeParams'];
    function ResultadoController(AppService, DonationService, ProyectService, $location, AdministracionService,
                                 $interval, $routeParams) {


        var vm = this;
        vm.proyectos = [];
        vm.type = AppService.type;
        vm.value = AppService.search;

        document.getElementById('resultados-search-box').focus();

        // FUNCTIONS
        vm.filtrar = filtrar;

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

        function filtrar(){
            ProyectService.get(function (data) {
                ProyectService.getByParams('nombre', vm.value, 'false', function (data) {

                    console.log(data);
                    vm.proyectos = data;
                });


            });
        }

    }
})();