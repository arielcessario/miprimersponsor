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
        vm.value = '';
        document.getElementById('resultados-search-box').focus();

        // FUNCTIONS
        vm.filtrar = filtrar;

        // INIT


        // Obtengo los proyectos

        AppService.listenCategoria(function(){
            ProyectService.getByParams('categoria_id', '' + AppService.search, 'true', function (data) {

                vm.proyectos = data;
            });
        });


        if (vm.type == 'c') {
            ProyectService.getByParams('categoria_id', '' + AppService.search, 'true', function (data) {

                vm.proyectos = data;
            });


        } else {

            vm.value = AppService.search;
            ProyectService.getByParams('nombre', '' + vm.value, 'false', function (data) {

                vm.proyectos = data;
            });


        }

        function filtrar() {
            ProyectService.get(function (data) {
                ProyectService.getByParams('nombre', vm.value, 'false', function (data) {

                    AppService.search = vm.value;
                    vm.proyectos = data;
                });


            });
        }

    }
})();