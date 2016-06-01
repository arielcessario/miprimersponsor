(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.proyecto', ['ngRoute'])
        .controller('ProyectoController', ProyectoController);


    ProyectoController.$inject = ['UserService', 'DonationService', 'ProyectService', '$routeParams', 'CommentService',
        'AcUtils', '$location', 'ContactsService', 'AppService', 'ProyectVars'];
    function ProyectoController(UserService, DonationService, ProyectService, $routeParams, CommentService,
                                AcUtils, $location, ContactsService, AppService, ProyectVars) {

        var vm = this;
        vm.proyectos = [];
        vm.proyecto = {};
        vm.donacion_cantidad = 0.0;
        vm.id = $routeParams.id;
        vm.user = UserService.getFromToken();
        vm.comentario = {};
        vm.comentarios = [];
        vm.donacion_rapida_valor = 0;
        vm.proyecto_similar_01 = {};
        vm.proyecto_similar_02 = {};
        vm.proyecto_similar_03 = {};
        vm.vals = [{val: 'Donar', amount: -1},
            {val: "$10", amount: 10},
            {val: "$25", amount: 25},
            {val: "$50", amount: 50},
            {val: "$75", amount: 75},
            {val: "$100", amount: 100},
            {val: "$200", amount: 200},
            {val: "$300", amount: 300},
            {val: "$400", amount: 400}];

        // Funciones
        vm.comentar = comentar;
        vm.back = back;

        // Init
        ProyectVars.activos = true;
        ProyectService.getByParams('proyecto_id', '' + vm.id, 'true', function (data) {
            vm.proyecto = data[0];
            vm.foto_selected = (vm.proyecto.fotos[0] == undefined) ? 'no_image.png' : vm.proyecto.fotos[0].nombre;
            vm.proyecto = angular.copy(data[0]);
            vm.proyecto.porc = Math.round(vm.proyecto.total_donado * 100 / vm.proyecto.costo_inicial);
            vm.proyecto.faltan = (new Date(new Date(vm.proyecto.fecha_fin) - new Date())).getDate();
            CommentService.get(vm.proyecto.proyecto_id, function (data) {

                if (data.length > 0) {
                    vm.comentarios = data;
                }
            });

            ProyectService.getByParams('categoria_id', '' + vm.proyecto.categoria_id, 'true', function (data) {

                vm.proyecto_similar_01 = data[0];
                vm.proyecto_similar_02 = data[1];
                vm.proyecto_similar_03 = data[2];

                if (vm.proyecto_similar_01 != undefined) {
                    vm.proyecto_similar_01 = angular.copy(data[0]);
                    vm.proyecto_similar_01.porc = Math.round(vm.proyecto_similar_01.total_donado * 100 / vm.proyecto_similar_01.costo_inicial);
                    vm.proyecto_similar_01.faltan = (new Date(new Date(vm.proyecto_similar_01.fecha_fin) - new Date())).getDate();
                }

                if (vm.proyecto_similar_02 != undefined) {
                    vm.proyecto_similar_02 = data[1];
                    vm.proyecto_similar_02.porc = Math.round(vm.proyecto_similar_02.total_donado * 100 / vm.proyecto_similar_02.costo_inicial);
                    vm.proyecto_similar_02.faltan = (new Date(new Date(vm.proyecto_similar_02.fecha_fin) - new Date())).getDate();
                }

                if (vm.proyecto_similar_03 != undefined) {
                    vm.proyecto_similar_03 = data[2];
                    vm.proyecto_similar_03.porc = Math.round(vm.proyecto_similar_03.total_donado * 100 / vm.proyecto_similar_03.costo_inicial);
                    vm.proyecto_similar_03.faltan = (new Date(new Date(vm.proyecto_similar_03.fecha_fin) - new Date())).getDate();
                }
            });
        });


        // Implementaciones


        function comentar() {


            if (!vm.user || vm.user.data.id == undefined) {
                AcUtils.showMessage('erro', 'Debe estar registrado para poder realizar comentarios');
                return;
            }

            if (vm.comentario.detalles == undefined || vm.comentario.detalles.trim() == '') {
                AcUtils.validations('proyecto-comentario-nuevo', 'El comentario no debe estar vacío');
                return;
            }

            vm.comentario.proyecto_id = vm.proyecto.proyecto_id;
            vm.comentario.titulo = '';
            vm.comentario.parent_id = 0;
            vm.comentario.creador_id = vm.user.data.id;
            vm.comentario.votos_up = 0;
            vm.comentario.votos_down = 0;


            CommentService.create(vm.comentario, function (data) {
                CommentService.get(vm.proyecto.proyecto_id, function (data) {
                    vm.comentario.detalles = '';
                    vm.comentarios = data;
                })
            });
        }

        function back() {
            $location.path(AppService.origen);
        }

    }
})();
