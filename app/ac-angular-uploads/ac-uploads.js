(function () {
    'use strict';

    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    if (currentScriptPath.length == 0) {
        //currentScriptPath = window.installPath + '/ac-angular-usuarios/includes/ac-usuarios.php';
        currentScriptPath = './ac-angular-uploads/includes/upload.php';
    }

    angular.module('acUploads', [])
        .directive('acUploadFiles', AcUploadFiles)
        .factory('UploadService', UploadService)
        .service('UploadVars', UploadVars)
    ;


    UploadService.$inject = ["UploadVars"];
    function UploadService(UploadVars) {
        var services = {};
        services.uploadImages = uploadImages;
        services.addImages = addImages;

        return services;

        /**
         * @description agrega las imagenes a una lista temporal y los sube
         * @param filelist
         * @param id identificador de la imagen para poder ubicar a que perteneces, proyecto, cliente, donación, etc.
         * TODO: Que no se pierda la lista cuando se refresca la pantalla
         */
        function addImages(filelist, id, sub_folder, callback) {


            for (var i = 0; i < filelist.length; ++i) {
                var file = filelist.item(i);
                uploadImages(file, sub_folder, callback);

                var encontrado = -1;
                for (var x = 0; x < UploadVars.uploadsList.length; x++) {
                    if (UploadVars.uploadsList[x].id == id) {
                        encontrado = x;
                    }
                }

                if (encontrado > -1) {
                    UploadVars.uploadsList[encontrado].file = file;
                } else {
                    UploadVars.uploadsList.push({id: id, file: file});
                }
            }
        }


        /**
         * @description Sube las imágenes al repositorio
         * @param file
         * @param tipo
         */
        function uploadImages(file, sub_folder, callback) {

            var form_data = new FormData();

            /* Limito la subida de archivos a 400kb*/
            if (file.size > 400000) {
                alert('No se puede subir un archivo que sea mayor a 400k');
                return;
            }
            form_data.append('images', file);
            form_data.append('folder', sub_folder);

            var ajax = new XMLHttpRequest();
            ajax.onprogress = function () {
            };
            ajax.onload = function (data) {
                console.log(UploadVars);
                //$scope.$apply();
                callback(data);
            };
            ajax.onerror = function(data){
                callback(data);
            };

            ajax.open("POST", currentScriptPath);
            ajax.send(form_data);


        }
    }

    function AcUploadFiles() {
        return {
            restrict: 'A',
            scope: {
                //attribute data-dbinf-on-files-selected (normalized to dbinfOnFilesSelected) identifies the action
                //to take when file(s) are selected. The '&' says to  execute the expression for attribute
                //data-dbinf-on-files-selected in the context of the parent scope. Note though that this '&'
                //concerns visibility of the properties and functions of the parent scope, it does not
                //fire the parent scope's $digest (dirty checking): use $scope.$apply() to update views
                //(calling scope.$apply() here in the directive had no visible effect for me).
                acUploadFiles: '&'
            },
            link: function (scope, element, attr, Controller) {
                element.bind("change", function () {  //match the selected files to the name 'selectedFileList', and
                    //execute the code in the data-dbinf-on-files-selected attribute
                    scope.acUploadFiles({selectedFileList: element[0].files});
                });
            }
        }
    }

    function UploadVars() {
        this.uploadsList = [];
    }
})();