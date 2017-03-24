Fenealweb.editMagDelega = function (params) {
    "use strict";

    var delega = params.id;
    var updateOperation = delega.id != "0" ? true : false;

    var title = ko.observable('Aggiorna magazzino');
    if (delega.id == "0")
        title('Crea delega mag.');


    var loadPanelVisibile = ko.observable(false);

    var viewModel = {
        cleanForm: function () {
            var formInstance = $('#form').dxForm('instance');
            formInstance.resetValues();
            formInstance.option('formData', delega);
        },
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

            //aggiungo il lavoratore..
            data.idLavoratore = delega.idLavoratore;


            var svc = new Fenealweb.services.lavoratoriService();
            svc.saveMagazzinoDelega(data)
            .done(function () {
                Fenealweb.app.currentViewModel = null;
                loadPanelVisibile(false);
                viewModel.cleanForm();
                Fenealweb.app.back();


            })
            .fail(function (error) {
                loadPanelVisibile(false);
                DevExpress.ui.notify(error, "error", 2500);
            });

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
                                   load: function (loadOptions) {
                                       var a = new Fenealweb.services.commonsService();
                                       return a.getListaProvince();
                                   },
                                   byKey: function (key) {
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
                           dataField: "ente",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: new DevExpress.data.DataSource({
                                   load: function (loadOptions) {
                                       var a = new Fenealweb.services.commonsService();
                                       return a.getListaEntiBilaterali();
                                   },
                                   byKey: function (key) {
                                       return $.Deferred().resolve(key).promise();
                                   }
                               }),
                               placeholder: 'Ente'
                           },
                           validationRules: [{
                               type: "required",
                               message: "Obbligatorio"
                           }]
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
                                    load: function (loadOptions) {
                                        var a = new Fenealweb.services.commonsService();
                                        return a.getListaCollaboratori();
                                    },
                                    byKey: function (key) {
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