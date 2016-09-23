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

                $timeout(function () {
                    //vm.showHint = $scope.hint == 'true';
                    vm.showHint = true;
                    vm.hint = $scope.recaudado + '/' + $scope.objetivo;
                    vm.porcentaje = (parseFloat($scope.recaudado) * 100) / parseFloat($scope.objetivo);
                    vm.toShow = parseInt((vm.porcentaje * 16) / 100);
                }, 1000);


            },
            templateUrl: 'ac-angular-progress-bar/ac-progress-bar.html',
            link: function (scope, element, attr) {

            },
            controllerAs: 'acProgressCtrl'
        };
    }

})();
