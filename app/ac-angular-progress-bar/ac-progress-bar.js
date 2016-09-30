(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('acProgressBar', ['ngRoute'])
        .directive('acProgressBar', AcProgressBar)
    ;


    /**
     * Directiva que muestra un panel de resultados de las b?squedas. Para darle aspecto, utilizar .ac-result-panel
     * @type {string[]}
     */


    AcProgressBar.$inject = ['$injector', '$compile', '$rootScope', '$timeout'];
    function AcProgressBar($injector, $compile, $rootScope, $timeout) {
        return {
            restrict: 'AE',
            scope: {
                recaudado: '@', // Campos en donde buscar, string separado por comas, sin espacios, y el nombre del campo de la tabla
                objetivo: '@', // Campos en donde buscar, string separado por comas, sin espacios, y el nombre del campo de la tabla
                hint: '@'
            },
            controller: function ($scope, $element, $attrs) {
                var vm = this;

                data();

                function data() {


                    $timeout(function () {


                        if ($scope.recaudado.length == 0 || $scope.objetivo.length == 0) {
                            if ($scope.recaudado.length == 0) {
                                $scope.recaudado = 0;
                            }
                            if ($scope.objetivo.length == 0) {
                                $scope.objetivo = 0;
                            }
                            data();
                            return;
                        }
                        vm.showHint = true;
                        var rec = (parseFloat($scope.recaudado) - (parseFloat($scope.recaudado) * 0.18));
                        vm.hint = '$'+ ((Math.round(rec * 100)) / 100) + '/ $' + $scope.objetivo;
                        vm.porcentaje = ((parseFloat($scope.recaudado)) - (parseFloat($scope.recaudado) * 0.18) * 100) / parseFloat($scope.objetivo);
                        vm.toShow = parseInt((vm.porcentaje * 16) / 100);

                    }, 1000);

                }


            },
            templateUrl: 'ac-angular-progress-bar/ac-progress-bar.html',
            link: function (scope, element, attr) {

            },
            controllerAs: 'acProgressCtrl'
        };
    }

})();
