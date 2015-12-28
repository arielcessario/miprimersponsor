(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.main', ['ngRoute', ['administracion/administracion.min.js']])
        .controller('MainController', MainController);


    MainController.$inject = ['UserService', 'DonationService', 'ProyectService', '$location', 'AdministracionService',
        '$interval'];
    function MainController(UserService, DonationService, ProyectService, $location, AdministracionService,
                            $interval) {

        var vm = this;
        vm.proyectos = [];
        vm.proyecto = {};
        vm.user = UserService.getFromToken();
        vm.donacion_rapida_valor = 10;
        vm.slider_nro = 1;
        vm.proyectos_slider = [];
        vm.proyecto_slider_01 = {};
        vm.proyecto_slider_02 = {};
        vm.proyecto_slider_03 = {};
        vm.proyecto_slider_04 = {};

        vm.proyecto_nuevo_01 = {};
        vm.proyecto_nuevo_02 = {};
        vm.proyecto_nuevo_03 = {};
        vm.proyecto_finalizar_01 = {};
        vm.proyecto_finalizar_02 = {};
        vm.proyecto_finalizar_03 = {};


        // FUNCTIONS
        vm.goToDetalle = goToDetalle;
        vm.goToCrear = goToCrear;

        // INIT

        // Obtengo los proyectos
        ProyectService.get(function (data) {


            ProyectService.getByParams('en_slider', '1', 'true', function (data) {
                vm.proyecto_slider_01 = data[0];
                vm.proyecto_slider_02 = data[0];
                vm.proyecto_slider_03 = data[0];
                vm.proyecto_slider_04 = data[0];
            });

            // obtengo los proyectos mas nuevos
            data.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.fecha_inicio) - new Date(a.fecha_inicio);
            });


            vm.proyecto_nuevo_01 = angular.copy(data[0]);
            vm.proyecto_nuevo_01.porc = Math.round(vm.proyecto_nuevo_01.total_donado * 100 / vm.proyecto_nuevo_01.costo_inicial);
            vm.proyecto_nuevo_01.faltan = (new Date(new Date(vm.proyecto_nuevo_01.fecha_fin) - new Date())).getDate();

            vm.proyecto_nuevo_02 = data[1];
            vm.proyecto_nuevo_02.porc = Math.round(vm.proyecto_nuevo_02.total_donado * 100 / vm.proyecto_nuevo_02.costo_inicial);
            vm.proyecto_nuevo_02.faltan = (new Date(new Date(vm.proyecto_nuevo_02.fecha_fin) - new Date())).getDate();

            vm.proyecto_nuevo_03 = data[2];
            vm.proyecto_nuevo_03.porc = Math.round(vm.proyecto_nuevo_03.total_donado * 100 / vm.proyecto_nuevo_03.costo_inicial);
            vm.proyecto_nuevo_03.faltan = (new Date(new Date(vm.proyecto_nuevo_03.fecha_fin) - new Date())).getDate();


            data.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.fecha_fin) - new Date(b.fecha_fin);
            });

            vm.proyecto_finalizar_01 = data[0];
            vm.proyecto_finalizar_01.porc = Math.round(vm.proyecto_finalizar_01.total_donado * 100 / vm.proyecto_finalizar_01.costo_inicial);
            vm.proyecto_finalizar_01.faltan = (new Date(new Date(vm.proyecto_finalizar_01.fecha_fin) - new Date())).getDate();

            vm.proyecto_finalizar_02 = data[1];
            vm.proyecto_finalizar_02.porc = Math.round(vm.proyecto_finalizar_02.total_donado * 100 / vm.proyecto_finalizar_02.costo_inicial);
            vm.proyecto_finalizar_02.faltan = (new Date(new Date(vm.proyecto_finalizar_02.fecha_fin) - new Date())).getDate();

            vm.proyecto_finalizar_03 = data[2];
            vm.proyecto_finalizar_03.porc = Math.round(vm.proyecto_finalizar_03.total_donado * 100 / vm.proyecto_finalizar_03.costo_inicial);
            vm.proyecto_finalizar_03.faltan = (new Date(new Date(vm.proyecto_finalizar_03.fecha_fin) - new Date())).getDate();

        });

        // Inicia Slider
        $interval(changeSlider, 3000);

        function changeSlider() {
            vm.slider_nro = (vm.slider_nro == 4) ? 1 : vm.slider_nro + 1;
        }


        // FUNCTIONS
        function goToCrear() {
            AdministracionService.screen = 'administracion/proyectos.html';
            $location.path('/administracion')
        }

        function goToDetalle(id) {

            $location.path('/proyecto/' + id);
        }




    }
})();