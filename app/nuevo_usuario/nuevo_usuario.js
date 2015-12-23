(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    //angular.module('uiglp.nuevoUsuario', ['ngRoute',['utils/utils.min.js']])
    angular.module('miprimersponsor.nuevoUsuario', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            //$routeProvider.when('/nuevo_usuario', {
            //    templateUrl: currentScriptPath.replace('.js', '.html'),
            //    controller: 'NuevoUsuarioController',
            //    data: {requiresLogin: false}
            //});
        }])
        .controller('NuevoUsuarioController', NuevoUsuarioController);


    NuevoUsuarioController.$inject = ['UserService', 'AcUtils', 'UserVars', '$location', 'AppService'];
    function NuevoUsuarioController(UserService, AcUtils, UserVars, $location, AppService) {

        var vm = this;

        vm.usuario = {
            cliente_id: -1,
            nombre: '',
            apellido: '',
            nro_doc: '',
            telefono: '',
            password: '',
            direccion: '',
            mail: '',
            rol_id: 1,
            cbu: '',
            social_login: 0
        };

        var _nombre = document.getElementById('nombre');
        //_nombre.focus();

        if (UserVars.user_social.given_name !== undefined) {
            vm.usuario.nombre = UserVars.user_social.given_name;
            vm.usuario.apellido = UserVars.user_social.family_name;
            vm.usuario.mail = UserVars.user_social.email;
            vm.usuario.social_login = (UserVars.user_social.user_id.indexOf('google') > -1) ? 1 : 2;
        }

        vm.saveUsuario = saveUsuario;


        function saveUsuario() {


            UserService.userExist(vm.usuario.mail, function (data) {
                if (data > 0) {
                    AcUtils.showMessage('error', 'El usuario ya existe');
                } else {



                    UserService.create(vm.usuario, function (data) {

                        if (data > -1) {
                            if(vm.usuario.social_login !==0){
                                UserService.loginSocial(vm.usuario, UserVars.token_social, function(data){
                                    $location.path('/administracion');
                                    AppService.broadcast();
                                });

                            }else{
                                UserService.login(vm.usuario.mail, vm.usuario.password, 1, function (data) {
                                    $location.path('/administracion');
                                    AppService.broadcast();
                                });
                            }


                        }
                    });
                }
            });


        }

    }
})();