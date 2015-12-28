(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('miPrimerSponsor', ['oc.lazyLoad',
        'ngRoute',
        'ngAnimate',
        'angular-storage',
        'angular-jwt',
        'duScroll',
        'auth0',
        'acUtils',
        'acUsuarios',
        'acProyectos',
        'acUploads',
        'acProgressBar',
        'acContacts',
        'acAnimate'
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

                $routeProvider.when('/resultados', {
                    templateUrl: 'resultados/resultados.html',
                    controller: 'ResultadoController',
                    data: {requiresLogin: false},
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load('resultados/resultados.js');
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

    AppController.$inject = ['UserService', '$location', 'AppService', 'CategoryService', '$timeout', '$document', '$scope',
        'DonationService', 'AcUtils', 'ContactsService', 'ProyectService'];
    function AppController(UserService, $location, AppService, CategoryService, $timeout, $document, $scope,
                           DonationService, AcUtils, ContactsService, ProyectService) {


        var vm = this;
        vm.hideLoader = true;
        vm.menu_mobile_open = false;
        vm.user = UserService.getFromToken();
        vm.isLogged = false;
        vm.welcomeTo = '';
        vm.categorias = [];
        vm.textProyecto = '';
        vm.proyecto = {};

        // FUNCTIONS
        vm.logout = logout;
        vm.goToAnchor = goToAnchor;
        vm.filterByCategory = filterByCategory;
        vm.filterByText = filterByText;
        vm.donacionRapida = donacionRapida;

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

        function goToAnchor(id) {
            $location.path('/main');

            $timeout(function () {
                var duration = 1000;
                var offset = 50; //pixels; adjust for floating menu, context etc
                //Scroll to #some-id with 30 px "padding"
                //Note: Use this in a directive, not with document.getElementById
                var someElement = angular.element(document.getElementById(id));
                $document.scrollToElement(someElement, offset, duration);
            }, 20);


        }

        $scope.$watch('appCtrl.textProyecto', function (newVal, oldVal) {
            if (newVal != oldVal && newVal != undefined && !AppService.vieneDeCat) {
                filterByText();
            }
            if (newVal == '' && !AppService.vieneDeCat) {
                $location.path('/main');
            } else {
                AppService.vieneDeCat = false;
            }
        });

        function filterByText() {
            AppService.search = vm.textProyecto;
            AppService.type = 't';
            AppService.search =  vm.textProyecto;
            $location.path('/resultados');

        }

        function filterByCategory(id) {
            AppService.vieneDeCat = true;
            AppService.type = 'c';
            AppService.search = id;
            vm.textProyecto = '';
            $location.path('/resultados');

        }

        function logout() {
            UserService.logout(function (data) {
                //console.log(data);
                $location.path('/ingreso');
                vm.isLogged = false;
                vm.welcomeTo = '';
                vm.user = false;
            });
        }

        function donacionRapida(cantidad, proyecto_id) {
            if (!vm.user) {
                $location.path('/ingreso');
                return;
            }

            if (cantidad < 0 || isNaN(cantidad)) {
                AcUtils.showMessage('error', 'La donación debe ser mayor a 0');
                cantidad = 0;
                return;
            }


            var donacion = {
                'proyecto_id': proyecto_id,
                'donador_id': vm.user.data.id,
                'valor': cantidad,
                'status': 0
            };
            DonationService.create(donacion, function (data) {

                // Enviar los mails
                if (data > 0) {
                    AcUtils.showMessage('success', 'Donación realizada con éxito, por favor aguarde la confirmación de la misma.');

                    ProyectService.getByParams('proyecto_id', '' + proyecto_id, 'true', function (data) {
                        // Mail a administrador
                        ContactsService.sendMail(vm.user.data.mail,
                            [
                                {mail: 'arielcessario@gmail.com'},
                                {mail: 'mmaneff@gmail.com'}
                            ],
                            'MPE', 'Existe un nuevo cambio para aprobar',
                            'NUEVA DONACIÓN - Proyecto ' + vm.proyecto.nombre, function (data) {
                                console.log(data);
                            });

                        // Mail a cliente
                        ContactsService.sendMail(vm.user.data.mail,
                            [
                                {mail: vm.user.data.mail}
                            ],
                            'MPE', 'Su donación ha sido realizada, por favor realice la transferencia correspondiente y espere a su aprobación.',
                            'NUEVA DONACIÓN - Proyecto ' + vm.proyecto.nombre, function (data) {
                                console.log(data);
                            });
                    });


                } else {
                    AcUtils.showMessage('error', 'Hubo un problema con la donación, por favor contacte al administrador');

                }
            })

        }


    }

    AppService.$inject = ['$rootScope'];
    function AppService($rootScope) {
        this.vieneDeCat = false;
        this.search = '';
        this.type = 'c';
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


//(function () {
//var cb = function() {
//    var l = document.createElement('link'); l.rel = 'stylesheet';
//    l.href = 'stylesheets/screen.css';
//    var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
//};
//var raf = requestAnimationFrame || mozRequestAnimationFrame ||
//    webkitRequestAnimationFrame || msRequestAnimationFrame;
//if (raf) raf(cb);
//else window.addEventListener('load', cb);
//})();




