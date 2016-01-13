(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.resultados', ['ngRoute', ['administracion/administracion.min.js']])
        .controller('ResultadoController', ResultadoController);


    ResultadoController.$inject = ['AppService', 'DonationService', 'ProyectService', '$location', 'AdministracionService',
        '$interval', '$routeParams', '$timeout'];
    function ResultadoController(AppService, DonationService, ProyectService, $location, AdministracionService,
                                 $interval, $routeParams, $timeout) {


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

                //vm.proyectos = data;
                procesarData(data);
            });
        });


        if (vm.type == 'c') {
            ProyectService.getByParams('categoria_id', '' + AppService.search, 'true', function (data) {

                //vm.proyectos = data;
                procesarData(data);
            });


        } else {

            vm.value = AppService.search;
            ProyectService.getByParams('nombre', '' + vm.value, 'false', function (data) {

                //vm.proyectos = data;
                procesarData(data);
            });


        }

        function filtrar() {
            ProyectService.get(function (data) {
                ProyectService.getByParams('nombre', vm.value, 'false', function (data) {

                    AppService.search = vm.value;
                    //vm.proyectos = data;
                    procesarData(data);
                });


            });
        }


        function procesarData(data){
            for(var i = 0; i<data.length; i++){
                data[i].porc = Math.round(data[i].total_donado * 100 / data[i].costo_inicial);
                data[i].faltan = (new Date(new Date(data[i].fecha_fin) - new Date())).getDate();
            }

            vm.proyectos = data;

        }

    }
})();