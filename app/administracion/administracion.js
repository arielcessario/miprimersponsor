(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.administracion', ['ngRoute'])

        .controller('AdministracionController', AdministracionController)
        .service('AdministracionService', AdministracionService);


    AdministracionController.$inject = ['UserService', 'AcUtils', 'ProyectService', '$location', 'UploadService',
        'UploadVars', '$scope', 'DonationService', 'DonationVars', 'CategoryService', 'AdministracionService', 'AcUtilsGlobals'];
    function AdministracionController(UserService, AcUtils, ProyectService, $location, UploadService,
                                      UploadVars, $scope, DonationService, DonationVars, CategoryService, AdministracionService, AcUtilsGlobals) {

        var vm = this;
        vm.screen = AdministracionService.screen;
        vm.usuarios = [];
        vm.user = UserService.getFromToken();
        vm.proyecto = {proyecto_id: -1};
        vm.proyectos = [];
        vm.showJustificaciones = false;
        vm.foto_01 = '';
        vm.foto_02 = '';
        vm.foto_03 = '';
        vm.foto_04 = '';
        vm.donaciones_entregadas = [];
        vm.donaciones_obtenidas = [];
        vm.cambios = [];
        vm.padres = [];
        vm.categoria = {};
        vm.proyecto_categoria = -1;


        // Funciones
        vm.modificarUsuario = modificarUsuario;
        vm.resetUsuario = resetUsuario;
        vm.saveUsuario = saveUsuario;
        vm.removeUsuario = removeUsuario;
        vm.updateUsuario = updateUsuario;

        vm.modificarProyecto = modificarProyecto;
        vm.resetProyecto = resetProyecto;
        vm.removeProyecto = removeProyecto;
        vm.createProyecto = createProyecto;
        vm.createCambio = createCambio;
        vm.updateFotoProyecto = updateFotoProyecto;

        vm.selectCambio = selectCambio;
        vm.confirmarCambio = confirmarCambio;
        vm.negarCambio = negarCambio;

        vm.modificarCategoria = modificarCategoria;
        vm.saveCategoria = saveCategoria;
        vm.removeCategoria = removeCategoria;


        // Init
        // Si no estoy ingresado, salgo, esto es un validación redundante ya que está la seguridad en app.js
        if (UserService.getFromToken() == false) {
            $location.path('/ingreso');
        }
        // Securizar navegacion y refrescar tablas
        $scope.$watch('administracionCtrl.screen', function (newValue, oldValue) {

            // Si ingreso a mis datos refresco
            if (newValue == 'administracion/datos.html') {
                if (vm.user.data != undefined && vm.user.data.rol == "0") {
                    UserService.get(function (data) {
                        vm.usuarios = data;
                    });
                }
            }

            //Si ingreso a mis aportes o mis patrocinadores refresco las donaciones en general
            if (newValue == 'administracion/patrocinadores.html' || newValue == 'administracion/aportes.html') {
                DonationVars.clearCache = true;
                DonationService.get(vm.user.data.id, function (data) {


                    for (var i = 0; i < data.length; i++) {

                        if (data[i].donador_id == vm.user.data.id) {
                            vm.donaciones_entregadas.push(data[i]);
                        } else {

                            vm.donaciones_obtenidas.push(data[i]);
                        }
                    }
                });
            }


            if (newValue == 'administracion/proyectos.html') {

                CategoryService.get(function (data) {

                    vm.categorias = data;
                    vm.proyecto_categoria = data[0].categoria_id
                });


                ProyectService.get(function (data) {
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            data[i].costo_inicial = parseFloat(data[i].costo_inicial);
                            data[i].total_donado = parseFloat(data[i].total_donado);
                            data[i].fecha_inicio = new Date(data[i].fecha_inicio);
                            data[i].fecha_fin = new Date(data[i].fecha_fin);
                            data[i].status = '' + data[i].status;

                        }
                        vm.proyectos = data;
                    }
                });
            }

            if (newValue == 'administracion/cambios.html') {
                ProyectService.getCambios(function (data) {

                    //console.log(data);

                    for (var i = 0; i < data.length; i++) {

                        if (data[i].fotos != "[]") {
                            data[i].fotos = JSON.parse(data[i].fotos);
                        }
                    }

                    vm.cambios = data;
                });
            }

            if (newValue == 'administracion/categorias.html') {
                CategoryService.get(function (data) {

                    vm.categorias = data;
                    vm.categoria.categoria_id = -1;
                });

                CategoryService.getByParams('parent_id', '-1', 'true', function (data) {

                    vm.padres = data;
                })
            }


        });


        // Implementaciones
        function modificarUsuario(usuario) {
            vm.usuario = angular.copy(usuario);
            vm.usuario.rol_id = '' + vm.usuario.rol_id;
            var elem = angular.element(document.querySelector('#nombre'));
            elem[0].focus();
        }

        function resetUsuario() {


            vm.usuario = {
                cliente_id: -1,
                nombre: '',
                apellido: '',
                nro_doc: '',
                telefono: '',
                password: '',
                direccion: '',
                mail: '',
                rol_id: '0'
            };

            AcUtilsGlobals.broadcast();
        }

        function saveUsuario() {
            UserService.create(vm.usuario, function (data) {
                UserService.get(function (data) {
                    vm.usuarios = data;
                });
            });
        }

        function removeUsuario() {

            var r = confirm('Realmente desea eliminar el usuario?');

            if (!r) {
                return;
            }

            UserService.removeUsuario(vm.usuario.cliente_id, function (data) {
                UserService.get(function (data) {
                    vm.usuarios = data;
                });
            });
        }

        function updateUsuario() {
            var conErrores = false;

            //if (vm.usuario.cliente_id == -1) {
            //    AcUtils.validations('nombre', 'Debe seleccionar un usuario');
            //    conErrores = true;
            //    return;
            //}
            //
            //if (vm.usuario.nombre.trim().length == 0) {
            //    AcUtils.validations('nombre', 'El nombre es obligatorio');
            //    conErrores = true;
            //}
            //
            //if (vm.usuario.apellido.trim().length == 0) {
            //    AcUtils.validations('apellido', 'El apellido es obligatorio');
            //    conErrores = true;
            //}
            //
            //if (vm.usuario.nro_doc.trim().length == 0) {
            //    AcUtils.validations('cuit', 'El CUIT es obligatorio');
            //    conErrores = true;
            //}
            //
            //if (vm.usuario.telefono.trim().length == 0) {
            //    AcUtils.validations('telefono', 'El teléfono es obligatorio');
            //    conErrores = true;
            //}
            ///*if (vm.usuario.password.trim().length == 0) {
            // //    AcUtilsService.validations('password', 'El password es obligatorio');
            // //    conErrores = true;
            // //}*/
            //if (vm.usuario.direccion.trim().length == 0) {
            //    AcUtils.validations('direccion', 'La dirección es obligatoria');
            //    conErrores = true;
            //}
            //
            //if (vm.usuario.rol_id == undefined) {
            //    AcUtils.validations('rol', 'Debe asignar un rol');
            //    conErrores = true;
            //}
            //
            //if (!AcUtils.validateEmail(vm.usuario.mail)) {
            //    AcUtils.validations('mail', 'El mail es incorrecto');
            //    conErrores = true;
            //}
            //
            //if (conErrores) {
            //    return;
            //}


            UserService.update(vm.usuario, function (data) {
                UserService.get(function (data) {

                    vm.usuarios = data;
                    vm.usuario = {
                        cliente_id: -1,
                        nombre: '',
                        apellido: '',
                        nro_doc: '',
                        telefono: '',
                        password: '',
                        direccion: '',
                        mail: '',
                        rol_id: '0'
                    };


                });
            });
        }


        function modificarProyecto(proyecto) {

            console.log(proyecto);
            vm.proyecto = angular.copy(proyecto);
            var elem = angular.element(document.querySelector('#nombre'));
            vm.foto_01 = (vm.proyecto.fotos[0] != undefined) ? vm.proyecto.fotos[0].nombre : 'no_image.png';
            vm.foto_02 = (vm.proyecto.fotos[1] != undefined) ? vm.proyecto.fotos[1].nombre : 'no_image.png';
            vm.foto_03 = (vm.proyecto.fotos[2] != undefined) ? vm.proyecto.fotos[2].nombre : 'no_image.png';
            vm.foto_04 = (vm.proyecto.fotos[3] != undefined) ? vm.proyecto.fotos[3].nombre : 'no_image.png';
            elem[0].focus();
            vm.proyecto_categoria = vm.proyecto.categoria_id;
        }

        function resetProyecto() {
            vm.proyecto = {
                cliente_id: -1,
                nombre: '',
                apellido: '',
                nro_doc: '',
                telefono: '',
                password: '',
                direccion: '',
                mail: '',
                rol_id: '0'
            };
        }


        function removeProyecto() {

            var r = confirm('Realmente desea eliminar el proyecto?');

            if (!r) {
                return;
            }

            ProyectService.removeProyecto(vm.proyecto.cliente_id, function (data) {
                ProyectService.get(function (data) {
                    vm.proyectos = data;
                });
            });
        }

        function createCambio() {



            //var jsonFotos = '';
            //if (UploadVars.uploadsList.length == 0) {
            //
            //    jsonFotos = JSON.stringify(vm.proyecto.fotos);
            //
            //} else {
            //    jsonFotos = "[";
            //    for (var i = 0; i < UploadVars.uploadsList.length; i++) {
            //        jsonFotos = jsonFotos + '{"main":"0","nombre":"' + UploadVars.uploadsList[i].file.name + '","folder":"","proyecto_id":"' + vm.proyecto.proyecto_id + '"}';
            //    }
            //    jsonFotos = jsonFotos + "]";
            //}

            var jsonFotos = "[";
            for (var i = 0; i < vm.proyecto.fotos.length; i++) {
                jsonFotos = jsonFotos + '{"main":"0","nombre":"' + vm.proyecto.fotos[i].nombre + '","folder":"","proyecto_id":"' + vm.proyecto.proyecto_id + '"},';
            }
            jsonFotos = jsonFotos.substring(0, jsonFotos.length - 1);
            jsonFotos = jsonFotos + "]";

            vm.proyecto.fotos = jsonFotos;

            vm.proyecto.fecha_fin = new Date((vm.proyecto.fecha_fin.getMonth() + 1) + '/' + (vm.proyecto.fecha_fin.getDate()) + '/' + vm.proyecto.fecha_fin.getFullYear());


            vm.proyecto.status_cambio = 1;
            vm.proyecto.usuario_id = vm.user.data.id;

            ProyectService.createCambio(vm.proyecto, function (data) {
                UploadVars.uploadsList = [];
                vm.proyecto = {proyecto_id: -1};
                vm.showJustificaciones = false;

            })
        }


        function createProyecto() {
            var conErrores = false;

            //if (vm.proyecto.cliente_id == -1) {
            //    AcUtils.validations('nombre', 'Debe seleccionar un proyecto');
            //    conErrores = true;
            //    return;
            //}
            //
            //if (vm.proyecto.nombre.trim().length == 0) {
            //    AcUtils.validations('nombre', 'El nombre es obligatorio');
            //    conErrores = true;
            //}
            //
            //if (vm.proyecto.apellido.trim().length == 0) {
            //    AcUtils.validations('apellido', 'El apellido es obligatorio');
            //    conErrores = true;
            //}
            //
            //if (vm.proyecto.nro_doc.trim().length == 0) {
            //    AcUtils.validations('cuit', 'El CUIT es obligatorio');
            //    conErrores = true;
            //}
            //
            //if (vm.proyecto.telefono.trim().length == 0) {
            //    AcUtils.validations('telefono', 'El teléfono es obligatorio');
            //    conErrores = true;
            //}
            ///*if (vm.proyecto.password.trim().length == 0) {
            // //    AcUtilsService.validations('password', 'El password es obligatorio');
            // //    conErrores = true;
            // //}*/
            //if (vm.proyecto.direccion.trim().length == 0) {
            //    AcUtils.validations('direccion', 'La dirección es obligatoria');
            //    conErrores = true;
            //}
            //
            //if (vm.proyecto.rol_id == undefined) {
            //    AcUtils.validations('rol', 'Debe asignar un rol');
            //    conErrores = true;
            //}
            //
            //if (!AcUtils.validateEmail(vm.proyecto.mail)) {
            //    AcUtils.validations('mail', 'El mail es incorrecto');
            //    conErrores = true;
            //}
            //
            //if (conErrores) {
            //    return;
            //}

            vm.proyecto.fotos = [
                {
                    main: 0,
                    nombre: vm.foto_01,
                    carpeta: '',
                    proyecto_id: -1
                }, {
                    main: 0,
                    nombre: vm.foto_02,
                    carpeta: '',
                    proyecto_id: -1
                }, {
                    main: 0,
                    nombre: vm.foto_03,
                    carpeta: '',
                    proyecto_id: -1
                }, {
                    main: 0,
                    nombre: vm.foto_04,
                    carpeta: '',
                    proyecto_id: -1
                }
            ];

            vm.proyecto.categorias = [{categoria_id: vm.proyecto_categoria}];


            vm.proyecto.fecha_fin = new Date((vm.proyecto.fecha_fin.getMonth() + 1) + '/' + (vm.proyecto.fecha_fin.getDate()) + '/' + vm.proyecto.fecha_fin.getFullYear());
            vm.proyecto.usuario_id = vm.user.data.id;

            if (vm.proyecto.proyecto_id == -1) {
                ProyectService.create(vm.proyecto, function (data) {
                    ProyectService.get(function (data) {
                        vm.proyectos = data;
                        UploadVars.uploadsList = [];
                        vm.proyecto = {proyecto_id: -1};
                    });
                });
            } else {

                vm.showJustificaciones = true;
                //ProyectService.update(vm.proyecto, function (data) {
                //    ProyectService.get(function (data) {
                //
                //        vm.proyectos = data;
                //        vm.proyecto = {
                //            cliente_id: -1,
                //            nombre: '',
                //            apellido: '',
                //            nro_doc: '',
                //            telefono: '',
                //            password: '',
                //            direccion: '',
                //            mail: '',
                //            rol_id: '0'
                //        };
                //
                //
                //    });
                //});
            }


        }


        function updateFotoProyecto(filelist, id, sub_folder) {
            UploadService.addImages(filelist, id, sub_folder, function (data) {
                for (var i = 0; i < UploadVars.uploadsList.length; i++) {
                    if (UploadVars.uploadsList[i].id == 1) {
                        vm.foto_01 = UploadVars.uploadsList[i].file.name;
                    }
                    if (UploadVars.uploadsList[i].id == 2) {
                        vm.foto_02 = UploadVars.uploadsList[i].file.name;
                    }
                    if (UploadVars.uploadsList[i].id == 3) {
                        vm.foto_03 = UploadVars.uploadsList[i].file.name;
                    }
                    if (UploadVars.uploadsList[i].id == 4) {
                        vm.foto_04 = UploadVars.uploadsList[i].file.name;
                    }

                }
                $scope.$apply();
                //console.log(data);
            })
        }


        /**
         * Selecciona un cambio de la tabla
         * @param cambio
         */
        function selectCambio(cambio) {
            vm.proyecto_modificado = cambio;

            ProyectService.getByParams('proyecto_id', '' + cambio.proyecto_id, '' + true, function (data) {
                vm.proyecto_original = data[0];
            })
        }

        /**
         * @description Cambia el estado del cambio a confirmado y guarda las modificaciones solicitadas al proyecto
         */
        function confirmarCambio() {

            vm.proyecto_modificado.status_cambio = 2;
            ProyectService.updateCambio(vm.proyecto_modificado, function (data) {

                if (data != -1) {
                    ProyectService.update(vm.proyecto_modificado, function (data) {
                        ProyectService.getCambios(function (data) {
                            vm.cambios = data;
                            vm.proyecto_original = {};
                            vm.proyecto_modificado = {};
                        })
                    })
                }
            })


        }

        /**
         * @descriptio Modifica el cambio a negado, no guarda cambios en el proyecto
         */
        function negarCambio() {
            vm.proyecto_modificado.status_cambio = 0;
            ProyectService.updateCambio(vm.proyecto_modificado, function (data) {
                ProyectService.getCambios(function (data) {
                    vm.cambios = data;
                    vm.proyecto_original = {};
                    vm.proyecto_modificado = {};
                })
            })
        }

        function removeCategoria() {

            var r = confirm("Realmente desea eliminar la categoria? Esta operación no tiene deshacer.");
            if (r) {

                CategoryService.remove(vm.id, function (data) {

                });
            }
        }


        function modificarCategoria(categoria) {
            vm.categoria = angular.copy(categoria);
            var elem = angular.element(document.querySelector('#nombre-categoria'));
            elem[0].focus();
        }

        function saveCategoria() {
            //console.log(vm.categoria);
            if (vm.categoria.parent_id == undefined) {
                vm.categoria.parent_id = -1;
            }

            if (vm.categoria.categoria_id != -1) {
                CategoryService.update(vm.categoria, function (data) {

                    if (data == 'true') {
                        CategoryService.get(function (data) {

                            vm.categorias = data;
                        });

                        CategoryService.getByParams('parent_id', '-1', 'true', function (data) {

                            vm.padres = data;
                        })
                    } else {

                    }
                });
            } else {
                CategoryService.create(vm.categoria, function (data) {
                    CategoryService.get(function (data) {

                        vm.categorias = data;
                    });

                    CategoryService.getByParams('parent_id', '-1', 'true', function (data) {

                        vm.padres = data;
                    })

                });
            }

            vm.categoria = {};
            vm.categoria.categoria_id = -1;

        }


    }

    function AdministracionService() {
        this.screen = 'administracion/datos.html';
    }
})();