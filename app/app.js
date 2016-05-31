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

                $routeProvider.when('/faq', {
                    templateUrl: 'faq/faq.html',
                    controller: 'FaqController',
                    data: {requiresLogin: false},
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load('faq/faq.js');
                        }]
                    }
                });

                $routeProvider.when('/legales', {
                    templateUrl: 'legales/legales.html',
                    controller: 'LegalController',
                    data: {requiresLogin: false},
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load('legales/legales.js');
                        }]
                    }
                });

                $routeProvider.when('/conozcanos', {
                    templateUrl: 'conozcanos/conozcanos.html',
                    controller: 'ConozcanosController',
                    data: {requiresLogin: false},
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load('conozcanos/conozcanos.js');
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
        .service('AppService', AppService)
        .factory('MPService', MPService)
    ;

    AppController.$inject = ['UserService', '$location', 'AppService', 'CategoryService', '$timeout', '$document', '$scope',
        'DonationService', 'AcUtils', 'ContactsService', 'ProyectService', '$window', 'MPService'];
    function AppController(UserService, $location, AppService, CategoryService, $timeout, $document, $scope,
                           DonationService, AcUtils, ContactsService, ProyectService, $window, MPService) {


        var vm = this;
        vm.hideLoader = true;
        vm.menu_mobile_open = false;
        vm.user = UserService.getFromToken();
        vm.isLogged = false;
        vm.welcomeTo = '';
        vm.categorias = [];
        vm.textProyecto = '';
        vm.proyecto = {};
        vm.moved = false;
        vm.link = '';
        vm.donacion = {};

        // FUNCTIONS
        vm.logout = logout;
        vm.goToAnchor = goToAnchor;
        vm.filterByCategory = filterByCategory;
        vm.filterByText = filterByText;
        vm.donacionRapida = donacionRapida;
        vm.goToDetalle = goToDetalle;

        // INIT
        ContactsService.facebookInit();
        twitter(document,'script', 'twitter-wjs');
        function twitter(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
            if (!d.getElementById(id)) {
                js = d.createElement(s);
                js.id = id;
                js.src = p + '://platform.twitter.com/widgets.js';
                fjs.parentNode.insertBefore(js, fjs);
            }
        };


        if (vm.user != false) {
            vm.isLogged = true;
            vm.welcomeTo = vm.user.data.nombre;
        }

        CategoryService.get(function (data) {

            vm.categorias = data;
        });


        angular.element($window).bind("scroll", function () {
            vm.moved = window.pageYOffset != 0;
            $scope.$apply();
        });

        function goToDetalle(id, origen) {

            AppService.origen = origen;
            $location.path('/proyecto/' + id);
        }

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
            //if (newVal == '' && !AppService.vieneDeCat) {
            //    $location.path('/main');
            //} else {
            //    AppService.vieneDeCat = false;
            //}
        });

        function filterByText() {
            AppService.type = 't';
            AppService.search = vm.textProyecto;
            $location.path('/resultados');

            $timeout(function () {
                vm.textProyecto = '';
            }, 1000);


        }

        function filterByCategory(id) {
            AppService.vieneDeCat = true;
            AppService.type = 'c';
            AppService.search = id;
            vm.textProyecto = '';
            $location.path('/resultados');
            AppService.broadcastCategoria();

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

        function donacionRapida(cantidad, proyecto_id, proyecto_nombre) {
            console.log(cantidad);

            if (!vm.user) {
                AcUtils.showMessage('error', 'Debe estar registrado e ingresado para poder realizar una donación.');
                $location.path('/ingreso');
                return;
            }

            if (cantidad != undefined && isNaN(cantidad) && cantidad.indexOf('searchDon') > -1) {
                cantidad = parseFloat(document.getElementById(cantidad).value);
            }

            if (cantidad < 1 || isNaN(cantidad)) {
                AcUtils.showMessage('error', 'La donación debe ser mayor a 0');
                cantidad = 0;
                return;
            }


            vm.donacion = {
                'proyecto_id': proyecto_id,
                'donador_id': vm.user.data.id,
                'valor': cantidad,
                'status': 0
            };

            vm.item = {
                'titulo': proyecto_nombre,
                'categoria': 'Mi Primer Sponsor',
                'cantidad': 1,
                'precio': cantidad,
                'mail': vm.user.data.mail
            };


            MPService.pay(vm.item, function (data) {
                console.log(data);
                vm.link = data.response.sandbox_init_point;


                $MPC.openCheckout({
                    url: vm.link,
                    mode: "modal",
                    onreturn: completarDonacion
                });
            });


        }

        function completarDonacion(json) {


            if (json.collection_status == 'approved') {
                console.log('Pago acreditado');
            } else if (json.collection_status == 'pending') {
                AcUtils.showMessage('error', 'El usuario no completó el pago');
                return;
            } else if (json.collection_status == 'in_process') {
                AcUtils.showMessage('error', 'El pago está siendo revisado');
                return;
            } else if (json.collection_status == 'rejected') {
                AcUtils.showMessage('error', 'El pago fué rechazado, el usuario puede intentar nuevamente el pago');
                return;
            } else if (json.collection_status == null) {
                AcUtils.showMessage('error', 'El usuario no completó el proceso de pago, no se ha generado ningún pago');
                return;
            }

            DonationService.create(vm.donacion, function (data) {

                // Enviar los mails
                if (data > 0) {
                    AcUtils.showMessage('success', 'Donación realizada con éxito, por favor aguarde la confirmación de la misma.');

                    ProyectService.getByParams('proyecto_id', '' + proyecto_id, 'true', function (data) {
                        // Mail a administrador
                        ContactsService.sendMail(vm.user.data.mail,
                            window.mailAdmins,
                            'MPE', 'Existe un nuevo cambio para aprobar',
                            'NUEVA DONACIÓN - Proyecto ' + ((vm.proyecto.nombre == undefined) ? proyecto_nombre : vm.proyecto.nombre), function (data) {
                                console.log(data);
                            });

                        // Mail a cliente
                        ContactsService.sendMail(window.mailAdmin,
                            [
                                {mail: vm.user.data.mail}
                            ],
                            'MPE', 'Su donación ha sido realizada, por favor realice la transferencia correspondiente y espere a su aprobación.',
                            'NUEVA DONACIÓN - Proyecto ' + ((vm.proyecto.nombre == undefined) ? proyecto_nombre : vm.proyecto.nombre), function (data) {
                                console.log(data);
                            });
                    });


                } else {
                    AcUtils.showMessage('error', 'Hubo un problema con la donación, por favor contacte al administrador');

                }
            })
        }

    }


    MPService.$inject = ['$http'];
    function MPService($http) {

        var service = {};
        service.pay = pay;
        return service;

        function pay(item, callback) {
            return $http.get('ac-mp.php?function=pay&item=' + JSON.stringify(item))
                .success(function (data) {
                    callback(data);
                })
                .error(function (data) {
                    console.log(data);
                });
        }
    }

    AppService.$inject = ['$rootScope'];
    function AppService($rootScope) {


        this.vieneDeCat = false;
        this.search = '';
        this.type = 'c';
        this.origen = '/main';
        this.listen = function (callback) {
            $rootScope.$on('miprimersponsorradio', callback);
        };

        this.broadcast = function () {
            $rootScope.$broadcast('miprimersponsorradio');
        };
        this.listenCategoria = function (callback) {
            $rootScope.$on('miprimersponsorradiocategoria', callback);
        };

        this.broadcastCategoria = function () {
            $rootScope.$broadcast('miprimersponsorradiocategoria');
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




