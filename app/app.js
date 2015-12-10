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

        var head = angular.element(document.querySelector('head')); // TO make the code IE < 8 compatible, include jQuery in your page and replace "angular.element(document.querySelector('head'))" by "angular.element('head')"

        if(head.scope().injectedStylesheets === undefined)
        {
            head.scope().injectedStylesheets = [];
            head.append($compile("<link data-ng-repeat='stylesheet in injectedStylesheets' data-ng-href='{{stylesheet.href}}' rel='stylesheet' />")(scope)); // Found here : http://stackoverflow.com/a/11913182/1662766
        }

        head.scope().injectedStylesheets.push({href: "./stylesheets/screen.css"});





        var vm = this;
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

        CategoryService.get(function(data){
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


