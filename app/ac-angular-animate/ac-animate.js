(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('acAnimate', ['ngRoute'])
        .directive('acAnimate', AcAnimate)
    ;


    /**
     * Directiva que muestra un panel de resultados de las b?squedas. Para darle aspecto, utilizar .ac-result-panel
     * @type {string[]}
     */


    AcAnimate.$inject = ['$injector', '$compile', '$rootScope', '$timeout', '$document'];
    function AcAnimate($injector, $compile, $rootScope, $timeout, $document) {
        return {
            restrict: 'AE',
            scope: {
                animationIn: '@', // Animación de entrada
                animationOut: '@', // Animación de salida
                correctionTop: '@', // Margen de corrección cuando llega al máximo
                correctionBottom: '@', // Margen de corrección desde abajo
                timing: '@' // Timing para la animación
            },
            controller: function ($scope, $element, $attrs) {
                var vm = this;

                $document.bind('scroll', onScroll);


                var latestKnownScrollY = 0,
                    ticking = false;

                /**
                 * Función que se ejecuta efectivamente en el scroll
                 */
                function onScroll() {
                    latestKnownScrollY = window.scrollY;
                    requestTick();
                }

                /**
                 * Se fija si ya está pedido un RAF
                 */
                function requestTick() {
                    if (!ticking) {
                        window.requestAnimationFrame(update);
                    }
                    ticking = true;
                }


                /**
                 * Función que contiene la lógica de ejecución
                 */
                function update() {
                    ticking = false;

                    var currentScrollY = latestKnownScrollY;
                    var rect = $element[0].getBoundingClientRect();

                    $scope.correctionBottom = ($scope.correctionBottom == undefined) ? 0 : $scope.correctionBottom;
                    $scope.correctionTop = ($scope.correctionTop == undefined) ? 0 : $scope.correctionTop;

                    var val = rect.top >= (0 - $scope.correctionTop) &&
                        rect.left >= 0 &&
                        rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight) - $scope.correctionBottom) && /*or $(window).height() */
                        rect.right <= (window.innerWidth || document.documentElement.clientWidth);
                    /*or $(window).width() */

                    var inOnce = false;


                    console.log(val);


                    if(val){

                    }


                }


            },
            link: function (scope, element, attr) {

            },
            controllerAs: 'acAnimateCtrl'
        };
    }

})();
