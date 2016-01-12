(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    angular.module('miprimersponsor.administracion', ['ngRoute'])

        .controller('AdministracionController', AdministracionController)
        .service('AdministracionService', AdministracionService);


    AdministracionController.$inject = ['UserService', 'AcUtils', 'ProyectService', '$location', 'UploadService',
        'UploadVars', '$scope', 'DonationService', 'DonationVars', 'CategoryService', 'AdministracionService', 'AcUtilsGlobals',
        'ContactsService', '$timeout', 'ProyectVars'];
    function AdministracionController(UserService, AcUtils, ProyectService, $location, UploadService,
                                      UploadVars, $scope, DonationService, DonationVars, CategoryService, AdministracionService, AcUtilsGlobals,
                                      ContactsService, $timeout, ProyectVars) {

        var vm = this;
        vm.screen = AdministracionService.screen;
        vm.usuarios = [];
        vm.usuario = {usuario_id: -1};
        vm.user = UserService.getFromToken();
        vm.proyecto = {proyecto_id: -1, status: '1', en_slider: '0'};
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
        vm.donaciones = [];
        vm.foto_01 = 'no_image.png';
        vm.foto_02 = 'no_image.png';
        vm.foto_03 = 'no_image.png';
        vm.foto_04 = 'no_image.png';
        vm.validation = true;


        // Funciones
        vm.modificarUsuario = modificarUsuario;
        vm.resetUsuario = resetUsuario;
        vm.saveUsuario = saveUsuario;
        vm.removeUsuario = removeUsuario;
        vm.updateUsuario = updateUsuario;

        vm.modificarProyecto = modificarProyecto;
        vm.resetProyecto = resetProyecto;
        vm.confirmarProyecto = confirmarProyecto;
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
        vm.resetCategoria = resetCategoria;

        vm.aprobarDonacion = aprobarDonacion;
        vm.cancelarDonacion = cancelarDonacion;
        vm.subirComprobante = subirComprobante;


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
                    UserService.getByParams('marcado', '0', 'true', function (data) {
                        vm.usuarios = data;
                        vm.usuario.rol_id = '1';
                    });
                } else {
                    vm.usuario = UserService.getLogged();
                }
            }

            //Si ingreso a mis aportes o mis patrocinadores refresco las donaciones en general
            if (newValue == 'administracion/patrocinadores.html' || newValue == 'administracion/aportes.html') {
                DonationVars.clearCache = true;
                vm.donaciones_entregadas = [];
                vm.donaciones_obtenidas = [];
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


                if (vm.user.data.rol == 0) {

                    ProyectVars.activos = false;
                    ProyectVars.clearCache = true;
                    ProyectService.get(function (data) {
                        if (data.length > 0) {

                            formatProyectos(data);
                        }
                    });
                } else {

                    ProyectService.getByParams('usuario_id', '' + vm.user.data.id, 'true', function (data) {
                        if (data.length > 0) {
                            formatProyectos(data);
                        }
                    });
                }

            }

            if (newValue == 'administracion/cambios.html') {
                ProyectService.getCambios(function (data) {

                    console.log(data);

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

            if (newValue == 'administracion/donaciones.html') {
                DonationService.get(-1, function (data) {

                    vm.donaciones = data;
                });

            }


        });

        // Implementaciones
        /**
         * Esta función es una auxiliar para resetear las validaciones y que funcionen después del guardar
         */
        function validate() {
            vm.validation = false;
            $timeout(function () {
                vm.validation = true;
            }, 1);
        }

        /**
         * Función auxiliar para mostar bien el proyecto
         * @param data
         */
        function formatProyectos(data) {
            for (var i = 0; i < data.length; i++) {
                data[i].costo_inicial = parseFloat(data[i].costo_inicial);
                data[i].total_donado = parseFloat(data[i].total_donado);
                data[i].fecha_inicio = new Date(data[i].fecha_inicio);
                data[i].fecha_fin = new Date(data[i].fecha_fin);

                if (data[i].status == 1) {
                    data[i].statusTexto = 'Activo';
                }
                if (data[i].status == 0) {
                    data[i].statusTexto = 'Baja';
                }
                if (data[i].status == 2) {
                    data[i].statusTexto = 'Terminado';
                }
                if (data[i].status == 3) {
                    data[i].statusTexto = 'Dinero Transferido';
                }
                if (data[i].status == 4) {
                    data[i].statusTexto = 'Pendiente de Aprobación';
                }


                data[i].status = '' + data[i].status;

            }
            vm.proyectos = data;
        }

        function modificarUsuario(usuario) {
            AcUtilsGlobals.broadcast();
            vm.usuario = angular.copy(usuario);
            vm.usuario.rol_id = '' + vm.usuario.rol_id;
            vm.usuario.calle = '' + vm.usuario.direcciones[0].calle;
            var elem = angular.element(document.querySelector('#nombre'));
            //elem[0].focus();
        }

        function resetUsuario() {


            vm.usuario = {
                usuario_id: -1,
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

            //UserService.create(vm.usuario, function (data) {
            //
            //    UserService.get(function (data) {
            //        vm.usuarios = data;
            //        resetUsuario();
            //        validate();
            //    });
            //
            //});
        }

        function removeUsuario() {

            if (vm.usuario.usuario_id == -1) {
                return;
            }

            var r = confirm('Realmente desea eliminar el usuario? Esta operación no se puede deshacer');

            if (!r) {
                return;
            }

            vm.usuario.marcado = 1;
            UserService.update(vm.usuario, function (data) {
                UserService.getByParams('marcado', '0', 'true', function (data) {
                    vm.usuarios = data;
                    resetUsuario();
                    validate();
                });
            });
        }

        function updateUsuario() {
            if (vm.user.data.rol != 0) {
                vm.usuario.rol_id = vm.user.data.rol;
            }

            if (vm.usuario.usuario_id == -1) {
                return;
            }


            UserService.update(vm.usuario, function (data) {

                if (vm.user.data.rol == 0) {
                    UserService.getByParams('marcado', '0', 'true', function (data) {

                        vm.usuarios = data;
                        resetUsuario();
                        validate();
                        AcUtils.showMessage('success', 'Datos Guardados con Éxito');
                    });
                } else {
                    vm.usuario.password = '';
                    UserService.setLogged(vm.usuario);
                    AcUtils.showMessage('success', 'Datos Guardados con Éxito');
                }


            });
        }

        function modificarProyecto(proyecto) {
            AcUtilsGlobals.broadcast();

            vm.proyecto = angular.copy(proyecto);
            vm.proyecto.en_slider = '' + vm.proyecto.en_slider;
            vm.proyecto_categoria = vm.proyecto.categoria_id;

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
                proyecto_id: -1,
                descripcion: '',
                nombre: '',
                categoria_id: '1',
                status: -1
            };

            vm.foto_01 = 'no_image.png';
            vm.foto_02 = 'no_image.png';
            vm.foto_03 = 'no_image.png';
            vm.foto_04 = 'no_image.png';


            vm.showJustificaciones = false;
        }

        function removeProyecto() {
            if (vm.proyecto.proyecto_id == -1) {
                AcUtils.showMessage('error', 'Debe seleccionar un proyecto');
                return;
            }

            var r = confirm('La eleminación de un proyecto debe ser aprobada por un administrador. Desea continuar?');

            if (!r) {
                return;
            }

            if (vm.proyecto.proyecto_id != -1) {
                vm.showJustificaciones = true;
                vm.proyecto.status = 0;
                return;
            }

            //if (vm.proyecto.proyecto_id == -1) {
            //    AcUtils.showMessage('error', 'Debe seleccionar un proyecto');
            //    return;
            //}
            //
            //var r = confirm('Realmente desea eliminar el proyecto?');
            //
            //if (!r) {
            //    return;
            //}
            //
            //vm.proyecto.status = 0;
            //ProyectService.update(vm.proyecto, function (data) {
            //    ProyectService.get(function (data) {
            //        formatProyectos(data);
            //        resetProyecto();
            //    });
            //});

        }

        function confirmarProyecto() {

            if (vm.proyecto.proyecto_id == -1) {
                return;
            }

            vm.proyecto.status = 1;
            vm.proyecto.categorias = [{categoria_id: vm.proyecto_categoria}];

            ProyectService.update(vm.proyecto, function (data) {
                ProyectVars.clearCache = true;
                ProyectService.get(function (data) {
                    if (data.length > 0) {
                        formatProyectos(data);
                        resetProyecto();
                        ContactsService.sendMail(window.mailAdmin,
                            [
                                {mail: vm.user.data.mail}
                            ],
                            'MPE', 'CONFIRMACIÓN DE PROYECTO - Proyecto ' + vm.proyecto.nombre,
                            'Se aprobó el proyecto', function (data) {
                                console.log(data);
                            });
                    }
                })

            });
        }

        function createCambio() {

            if (vm.proyecto.justificacion == undefined || vm.proyecto.justificacion.replace(' ', '').length == '') {

                AcUtils.showMessage('error', 'Debe ingresar una justificación para el cambio');
                return;
            }

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
            vm.proyecto.categorias = vm.proyecto_categoria;

            ProyectService.createCambio(vm.proyecto, function (data) {
                UploadVars.uploadsList = [];
                vm.showJustificaciones = false;
                validate();
                ContactsService.sendMail(vm.user.data.mail,
                    window.mailAdmins,
                    'MPE', 'CREACIÓN DE CAMBIO - Proyecto ' + vm.proyecto.nombre,
                    'Existe un nuevo cambio para aprobar', function (data) {
                        console.log(data);
                    });


                vm.proyecto = {proyecto_id: -1};


            })
        }

        function createProyecto() {

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

            if (vm.proyecto.proyecto_id != -1) {
                vm.showJustificaciones = true;
                return;
            }

            vm.proyecto.status = 4;


            ProyectService.create(vm.proyecto, function (data) {

                AcUtils.showMessage("success", "El proyecto ha sido creado, por favor aguarde la aprobación del administrador. Gracias.");

                ContactsService.sendMail(vm.user.data.mail,
                    window.mailAdmins,
                    'MPE', 'CREACIÓN DE NUEVO PROYECTO - Proyecto ' + vm.proyecto.nombre,
                    'Existe un nuevo proyecto para aprobar', function (data) {
                        console.log(data);
                    });

                if (vm.user.data.rol == "0") {
                    ProyectService.get(function (data) {
                        formatProyectos(data);
                        UploadVars.uploadsList = [];
                        //vm.proyecto = {proyecto_id: -1};
                        resetProyecto();
                        validate();
                    });
                } else {
                    ProyectService.getByParams('usuario_id', '' + vm.user.data.id, 'true', function (data) {
                        if (data.length > 0) {
                            formatProyectos(data);
                        }
                        resetProyecto();
                        validate();
                    });
                }

            });
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


            if (vm.proyecto_modificado.respuesta == undefined || vm.proyecto_modificado.respuesta.trim().length == 0) {
                AcUtils.showMessage('error', 'Debe ingregar una respuesta para el usuario');
                return;
            }


            vm.proyecto_modificado.status_cambio = 2;
            vm.proyecto_modificado.aprobador_id = vm.user.data.id;
            vm.proyecto_modificado.categorias = [{categoria_id: vm.proyecto_modificado.categorias}];


            console.log(vm.proyecto_modificado);
            ProyectService.updateCambio(vm.proyecto_modificado, function (data) {

                if (data != -1) {
                    ProyectService.update(vm.proyecto_modificado, function (data) {
                        ProyectService.getCambios(function (data) {
                            ContactsService.sendMail(vm.user.data.mail,
                                [
                                    {mail: vm.proyecto_original.mail}
                                ],
                                'MPE', 'CONFIRMACIÓN DE CAMBIO - Proyecto ' + vm.proyecto.nombre,
                                'Su cambio ha sido aprobado', function (data) {
                                    console.log(data);
                                });


                            vm.cambios = data;
                            vm.proyecto_original = {};
                            vm.proyecto_modificado = {};
                            validate();


                        })
                    })
                }
            })


        }

        /**
         * @descriptio Modifica el cambio a negado, no guarda cambios en el proyecto
         */
        function negarCambio() {

            if (vm.proyecto_modificado.respuesta == undefined || vm.proyecto_modificado.respuesta.trim().length == 0) {
                AcUtils.showMessage('error', 'Debe ingregar una respuesta para el usuario');
                return;
            }

            vm.proyecto_modificado.status_cambio = 0;
            vm.proyecto_modificado.aprobador_id = vm.user.data.id;
            ProyectService.updateCambio(vm.proyecto_modificado, function (data) {
                ProyectService.getCambios(function (data) {
                    ContactsService.sendMail(vm.user.data.mail,
                        [
                            {mail: vm.proyecto_original.mail}
                        ],
                        'MPE', 'CANCELACIÓN DE CAMBIO - Proyecto ' + vm.proyecto.nombre,
                        'Su cambio ha sido cancelado', function (data) {
                            console.log(data);
                        });
                    vm.cambios = data;
                    vm.proyecto_original = {};
                    vm.proyecto_modificado = {};
                    validate();

                })
            })
        }

        function removeCategoria() {

            console.log(vm.categoria);
            if (vm.categoria.categoria_id == -1) {
                AcUtils.showMessage('error', 'No ha seleccionado una categoría.')
                return;
            }


            var r = confirm("Realmente desea eliminar la categoria? Esta operación no tiene deshacer.");
            if (r) {

                categoria
                CategoryService.update(vm.categoria, function (data) {

                });
                //CategoryService.remove(vm.categoria.categoria_id, function (data) {
                //
                //});
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


            if(vm.categoria.nombre == undefined || vm.categoria.nombre.replace(' ', '').length == 0 ){
                AcUtils.showMessage('error','El nombre no puede ser vacío');
                return;
            }



            if (vm.categoria.categoria_id != -1) {
                CategoryService.update(vm.categoria, function (data) {

                    if (data == 'true') {
                        CategoryService.get(function (data) {
                            vm.categorias = data;
                            validate();
                        });

                        CategoryService.getByParams('parent_id', '-1', 'true', function (data) {
                            vm.padres = data;
                            validate();
                        });

                    } else {

                    }
                });
            } else {
                CategoryService.create(vm.categoria, function (data) {
                    CategoryService.get(function (data) {
                        vm.categorias = data;
                        validate();
                    });

                    CategoryService.getByParams('parent_id', '-1', 'true', function (data) {
                        vm.padres = data;
                        validate();
                    });
                });
            }

            vm.categoria = {};
            vm.categoria.categoria_id = -1;

        }

        function aprobarDonacion(donacion) {
            if (!vm.user) {
                $location.path('/ingreso');
                return;
            }

            donacion.status = 1;
            DonationService.update(donacion, function (data) {


                // Enviar los mails
                UserService.getByParams('usuario_id', '' + donacion.donador_id, 'true', function (data) {
                    ContactsService.sendMail(window.mailAdmin,
                        [{mail: data[0].mail}],
                        'Ariel',
                        'PRUEBA',
                        'PRUEBA DE CONFIRMACIÓN DE DONACIÓN',
                        function (data, result) {
                            console.log(data);
                            console.log(result);

                        });
                });


                DonationService.get(-1, function (data) {

                    vm.donaciones = data;

                    ProyectVars.clearCache = true;
                    ProyectService.get(function (data) {
                    });

                })

            })
        }

        function cancelarDonacion(donacion) {
            if (!vm.user) {
                $location.path('/ingreso');
                return;
            }

            donacion.status = 2;
            DonationService.update(donacion, function (data) {


                // Enviar los mails
                UserService.getByParams('usuario_id', '' + donacion.donador_id, 'true', function (data) {
                    ContactsService.sendMail(window.mailAdmin,
                        [{mail: data[0].mail}],
                        'Ariel',
                        'PRUEBA',
                        'PRUEBA DE CANCELACIÓN DE DONACIÓN',
                        function (data, result) {
                            console.log(data);
                            console.log(result);

                        });
                });

                DonationService.get(-1, function (data) {

                    vm.donaciones = data;

                    ProyectVars.clearCache = true;
                    ProyectService.get(function (data) {
                    });

                })

            })
        }

        function resetCategoria() {
            vm.categoria = {
                categoria_id: -1,
                nombre: '',
                parent_id: -1
            };
        }

        function subirComprobante(filelist) {

            UploadService.uploadImages(filelist.item(0), '', function (data) {
                ProyectService.confirmarDeposito(vm.proyecto.proyecto_id, filelist.item(0).name, function (data) {
                    console.log(data);
                    ProyectService.get(function (data) {
                        vm.proyectos = data;
                    })
                })
            });


        }

    }

    function AdministracionService() {
        this.screen = 'administracion/datos.html';
    }


})();