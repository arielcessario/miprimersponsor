(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.ingreso', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            //$routeProvider.when('/ingreso', {
            //    templateUrl: currentScriptPath.replace('.min.js', '.html'),
            //    controller: 'IngresoController',
            //    data: {requiresLogin: false}
            //});
        }])
        .controller('IngresoController', IngresoController);


    IngresoController.$inject = ['UserService', 'AcUtils', '$location', 'UserVars', 'AppService'];
    function IngresoController(UserService, AcUtils, $location, UserVars, AppService) {

        var vm = this;
        vm.login = login;
        vm.loginFacebook = loginFacebook;
        vm.loginGoogle = loginGoogle;
        vm.nuevoUsuario = nuevoUsuario;
        vm.recuperarPassword = recuperarPassword;
        vm.mail = '';
        vm.password = '';
        vm.loginPrev = loginPrev;


        function loginPrev(event) {
            if (event.keyCode == 13) {
                login();
            }
        }

        if (UserService.getFromToken() != false) {
            $location.path('/main');
        }


        function recuperarPassword() {
            if (!AcUtils.validateEmail(vm.mail)) {
                AcUtils.validations('mail', 'El mail es incorrecto');
                return;
            }
            UserService.forgotPassword(vm.mail, function (data) {
                console.log(data);
            });
        }

        function nuevoUsuario() {
            $location.path('/nuevo_usuario');
        }


        function loginFacebook(){

            UserService.loginFacebook(function(data){
                if(data == -1){
                    // debe crear el usuario
                    $location.path('/nuevo_usuario');
                }else{
                    // usuario existe y se logea
                    $location.path('/main');
                    AppService.broadcast();
                }
            });
        }

        function loginGoogle(){

            UserService.loginGoogle(function(data){
                if(data == -1){
                    // debe crear el usuario
                    $location.path('/nuevo_usuario');
                }else{
                    // usuario existe y se logea
                    $location.path('/main');
                    AppService.broadcast();
                }
            });
        }


        function login() {


            UserService.login(vm.mail, vm.password, 1, function (data) {
                if(data == -1){
                    AcUtils.showMessage('error', 'Mail o Contraseña erroneos');
                }else{
                    $location.path('/main');
                    AppService.broadcast();
                }
            });
        }



    }
})();