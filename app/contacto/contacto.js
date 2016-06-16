(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.contacto', [])
        .controller('ContactoController', ContactoController);


    ContactoController.$inject = ['ContactsService'];
    function ContactoController(ContactsService) {
        var vm = this;
        vm.email = '';
        vm.nombre = '';
        vm.mensaje = '';
        vm.asunto = '';
        vm.enviado = false;
        vm.enviando = false;

        vm.sendMail = sendMail;


        function sendMail() {
            if(vm.enviando){
                return;
            }
            vm.enviando = true;

            ContactsService.sendMail(vm.email,
                [{mail: 'arielcessario@gmail.com'}],
                vm.nombre,
                vm.mensaje,
                vm.asunto,
                function (data, result) {
                    vm.enviando = false;
                    console.log(data);
                    console.log(result);

                    vm.email = '';
                    vm.nombre = '';
                    vm.asunto = '';
                    vm.mensaje = '';

                });
        }
    }
})();