(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('miPrimerSponsor', ['oc.lazyLoad',
        'ngRoute',
        'ngAnimate',
        'angular-storage',
        'angular-jwt',
        'auth0',
        'acUtils',
        'acUsuarios',
        'acProyectos',
        'acUploads',
        'acProgressBar',
        'acContacts'
    ]).config(['$routeProvider', 'authProvider',
            function ($routeProvider, authProvider) {


                authProvider.init({
                    domain: 'ac-desarrollos.auth0.com',
                    clientID: 'su5JUmdUk52EWhfK5xxZJtnw6W3IK9c1',
                    loginUrl: '/ingreso'
                });

                $routeProvider.otherwise('/main');


                $routeProvider.when('/main', {
                    templateUrl: 'main/main.html',
                    controller: 'MainController',
                    data: {requiresLogin: false},
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load('main/main.js');
                        }]
                    }
                });

                $routeProvider.when('/administracion', {
                    templateUrl: 'administracion/administracion.html',
                    controller: 'AdministracionController',
                    data: {requiresLogin: true},
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load('administracion/administracion.js');
                        }]
                    }
                });

                $routeProvider.when('/nuevo_usuario', {
                    templateUrl: 'nuevo_usuario/nuevo_usuario.html',
                    controller: 'NuevoUsuarioController',
                    data: {requiresLogin: false},
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load('nuevo_usuario/nuevo_usuario.js');
                        }]
                    }
                });

                $routeProvider.when('/ingreso', {
                    templateUrl: 'ingreso/ingreso.html',
                    controller: 'IngresoController',
                    data: {requiresLogin: false},
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load('ingreso/ingreso.js');
                        }]
                    }
                });

                $routeProvider.when('/proyecto/:id', {
                    templateUrl: 'proyecto/proyecto.html',
                    controller: 'ProyectoController',
                    data: {requiresLogin: false},
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load('proyecto/proyecto.js');
                        }]
                    }
                });


            }])
        .run(function ($rootScope, store, jwtHelper, $location, auth) {

            auth.hookEvents();

            $rootScope.$on('$routeChangeStart', function (e, to) {


                if (to && to.data && to.data.requiresLogin) {
                    //if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                    if (!store.get(window.appName)) {
                        e.preventDefault();
                        $location.path('/ingreso');
                    }
                }
            });

        })
        .controller('AppController', AppController)
        .service('AppService', AppService);

    AppController.$inject = ['UserService', '$location', 'AppService', 'CategoryService'];
    function AppController(UserService, $location, AppService, CategoryService) {




        var vm = this;
        vm.hideLoader = true;
        vm.menu_mobile_open = false;
        vm.user = UserService.getFromToken();
        vm.isLogged = false;
        vm.welcomeTo = '';
        vm.categorias = [];

        // FUNCTIONS
        vm.logout = logout;

        // INIT
        if (vm.user != false) {
            vm.isLogged = true;
            vm.welcomeTo = vm.user.data.nombre;
        }

        CategoryService.get(function (data) {
            vm.categorias = data;
        });


        /**
         * @description Recibo el login o logout
         */
        AppService.listen(function () {
            vm.user = UserService.getFromToken();
            if (vm.user != false) {
                vm.isLogged = true;
                vm.welcomeTo = vm.user.data.nombre;
            } else {
                $location.path('/ingreso');
                vm.isLogged = false;
                vm.welcomeTo = '';
                vm.user = false;
            }
        });


        function logout() {
            UserService.logout(function (data) {
                //console.log(data);
                $location.path('/ingreso');
                vm.isLogged = false;
                vm.welcomeTo = '';
                vm.user = false;
            });
        }


    }

    AppService.$inject = ['$rootScope'];
    function AppService($rootScope) {
        this.listen = function (callback) {
            $rootScope.$on('miprimersponsorradio', callback);
        };

        this.broadcast = function () {
            $rootScope.$broadcast('miprimersponsorradio');
        }
    }
})();

WebFontConfig = {
    google: {families: ['Droid+Sans:400,700:latin']}
};
(function () {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();


(function () {
var cb = function() {
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'stylesheets/screen.css';
    var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
};
var raf = requestAnimationFrame || mozRequestAnimationFrame ||
    webkitRequestAnimationFrame || msRequestAnimationFrame;
if (raf) raf(cb);
else window.addEventListener('load', cb);
})();




