﻿Fenealweb.editDelega = function (params) {
    "use strict";


    var delega = params.id;
    var updateOperation = lavoratore.id != "0" ? true : false;

    var title = ko.observable('Aggiorna delega');
    if (lavoratore.id == "0")
        title('Crea delega');


    var aziendaDataSource = new DevExpress.data.DataSource({
        load(loadOptions) {

            var a = new Fenealweb.services.aziendeService();
            var p = a.searchAziende(loadOptions.searchValue);

            return p;
        },
        byKey: function (key) {
            return $.Deferred().resolve(key).promise();
        }
    });


    var loadPanelVisibile = ko.observable(false);


    var viewModel = {
        loadOptions: {
            visible: loadPanelVisibile,
            showIndicator: true,
            showPane: true,
            shading: true,
            closeOnOutsideClick: false,
            shadingColor: "rgba(0,0,0,0.4)",
            position: { of: "body" }
        },
        title: title,
        save: function () {
            var formInstance = $('#form').dxForm('instance');
            var data = formInstance.option('formData');
            //valido
            var res = formInstance.validate();
            if (!res.isValid) {
                console.log(data);
                DevExpress.ui.notify("Controllare alcuni valori mancanti", "error", 2500);
                return;
            }
            loadPanelVisibile(true);

            data.id = delega.id;

            alert('save');

            //var svc = new Fenealweb.services.lavoratoriService();
            //svc.saveLavoratore(data)
            //.done(function () {
            //    Fenealweb.app.currentViewModel = null;
            //    loadPanelVisibile(false);
            //    //se creo un nuovo elemento
            //    //vado direttemtne alla vista per il caricamento dei dati
            //    //altrimenti vado indietro
            //    if (updateOperation) {
            //        Fenealweb.app.back();
            //    } else {

            //        Fenealweb.app.navigate({
            //            view: 'lavoratore',
            //            fiscale: data.fiscale
            //        }, { target: 'current' });

            //    }
            //})
            //.fail(function (error) {
            //    loadPanelVisibile(false);
            //    DevExpress.ui.notify(error, "error", 2500);
            //});

        },
        viewShown: function (e) {
            Fenealweb.app.currentViewModel = e.viewInfo.model;
        },
        formOptions: {
            colCount: 2,
            formData: delega,

            items: [
                {
                    itemType: "group",
                    caption: "Dati generali",
                    items: [
                       {
                           dataField: "provincia",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: new DevExpress.data.DataSource({
                                   load(loadOptions) {
                                       var a = new Fenealweb.services.commonsService();
                                       return a.getListaProvince();
                                   },
                                   byKey(key) {
                                       return $.Deferred().resolve(key).promise();
                                   }
                               }),
                               placeholder: 'Provincia',
                           },
                           validationRules: [{
                               type: "required",
                               message: "Obbligatorio"
                           }]
                       },
                       {
                           dataField: "causaleIscrizione",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: new DevExpress.data.DataSource({
                                   load(loadOptions) {
                                       var a = new Fenealweb.services.commonsService();
                                       return a.getListaCausaliDelega();
                                   },
                                   byKey(key) {
                                       return $.Deferred().resolve(key).promise();
                                   }
                               }),
                               valueExpr: 'value',
                               displayExpr: 'label',
                               placeholder: 'Causale iscrizione'
                           },
                           validationRules: [{
                               type: "required",
                               message: "Obbligatorio"
                           }]
                       },
                       {
                           dataField: "settore",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: new DevExpress.data.DataSource({
                                   load(loadOptions) {
                                       var a = new Fenealweb.services.commonsService();
                                       return a.getSettoriBase();
                                   },
                                   byKey(key) {
                                       return $.Deferred().resolve(key).promise();
                                   }
                               }),
                               placeholder: 'Settore'
                           },
                           validationRules: [{
                               type: "required",
                               message: "Obbligatorio"
                           }]
                       },
                       {
                           dataField: "ente",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: new DevExpress.data.DataSource({
                                   load(loadOptions) {
                                       var a = new Fenealweb.services.commonsService();
                                       return a.getListaEntiBilaterali();
                                   },
                                   byKey(key) {
                                       return $.Deferred().resolve(key).promise();
                                   }
                               }),
                               placeholder: 'Ente'
                           }
                       },
                       {
                           dataField: "azienda",
                           editorType: "dxLookup",
                           editorOptions: {
                               dataSource: aziendaDataSource,
                               value: selectedAzienda,
                               showPopupTitle: true,
                               valueChangeEvent: 'input',
                               title: "Ricerca azienda",
                               placeholder: "Azienda",
                               displayExpr: "descrizione",
                               valueExpr: "id",
                               showClearButton: true,
                               clearButtonText: 'Pulisci',
                               cancelButtonText: 'Annulla'
                           }
                       },
                       {
                           colSpan: 2,
                           dataField: "note",
                           editorType: "dxTextArea",
                       }]
                },
                 {
                     itemType: "group",
                     caption: "Collaboratore",
                     items: [
                        {
                            dataField: "collaboratore",
                            editorType: "dxSelectBox",
                            editorOptions: {
                                dataSource: new DevExpress.data.DataSource({
                                    load(loadOptions) {
                                        var a = new Fenealweb.services.commonsService();
                                        return a.getListaCollaboratori();
                                    },
                                    byKey(key) {
                                        return $.Deferred().resolve(key).promise();
                                    }
                                }),
                                valueExpr: 'value',
                                displayExpr: 'label',
                                placeholder: 'Collaboratore'
                            }
                        }
                     ]
                 }
            ]



        }
    };

    return viewModel;
};