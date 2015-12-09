(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.proyecto', ['ngRoute'])
        .controller('ProyectoController', ProyectoController);


    ProyectoController.$inject = ['UserService', 'DonationService', 'ProyectService', '$routeParams', 'CommentService', 'AcUtils'];
    function ProyectoController(UserService, DonationService, ProyectService, $routeParams, CommentService, AcUtils) {

        var vm = this;
        vm.proyectos = [];
        vm.proyecto = {};
        vm.donacion_cantidad = 0.0;
        vm.id = $routeParams.id;
        vm.user = UserService.getFromToken();
        vm.comentario = {};
        vm.comentarios = [];

        // Funciones
        vm.donar = donar;
        vm.comentar = comentar;

        // Init
        ProyectService.getByParams('proyecto_id', '' + vm.id, 'true', function (data) {
            vm.proyecto = data[0];
            vm.proyecto = angular.copy(data[0]);
            vm.proyecto.porc = Math.round(vm.proyecto.total_donado * 100 / vm.proyecto.costo_inicial);
            vm.proyecto.faltan = (new Date(new Date(vm.proyecto.fecha_fin) - new Date())).getDate();
            CommentService.get(vm.proyecto.proyecto_id, function (data) {
                vm.comentarios = data;
            })
        });

        // Implementaciones

        function donar() {
            var donacion = {
                'proyecto_id': vm.id,
                'donador_id': vm.user.data.id,
                'valor': vm.donacion_cantidad,
                'status': 0
            };
            DonationService.create(donacion, function (data) {

                // Enviar los mails
                console.log(data);
            })
        }

        function comentar() {
            if (vm.user.data.id == undefined) {
                alert('Debe estar registrado para poder realizar comentarios');
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


    }
})();
