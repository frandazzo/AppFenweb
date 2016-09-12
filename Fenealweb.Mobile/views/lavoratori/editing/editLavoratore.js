Fenealweb.editLavoratore = function (params) {
    "use strict";


    var lavoratore = params.id;
    var updateOperation = lavoratore.id != "0" ? true : false;

    var title = ko.observable('Aggiorna dati');
    if (lavoratore.id == "0")
        title('Crea lavoratore');


    var sexList = [
        {
            value: "M",
            label: "UOMO"
        },
        {
            value: "F",
            label: "DONNA"
        }
    ];


    //normalizzo la data di nascita
    lavoratore.dataNascita = new Date(lavoratore.dataNascitaTime);


    var geoProvinceNascitaSelected = ko.observable('');
    var comuneValue = ko.observable('');

    var comuniNascitaDataSource = new DevExpress.data.DataSource({
        load(loadOptions) {

            if (!loadOptions.searchValue) {
                var d = $.Deferred();
                return d.resolve([]).promise();
            }
            var a = new Fenealweb.services.commonsService();
            return a.getGeoComuni(loadOptions.searchValue);
        },
        byKey(key) {
            return $.Deferred().resolve(key).promise();
        }
    });

    var comuniResidenzaDataSource = new DevExpress.data.DataSource({
        load(loadOptions) {

            if (!loadOptions.searchValue) {
                var d = $.Deferred();
                return d.resolve([]).promise();
            }
            var a = new Fenealweb.services.commonsService();
            return a.getGeoComuni(loadOptions.searchValue);
        },
        byKey(key) {
            return $.Deferred().resolve(key).promise();
        }
    });
   
    var loadPanelVisibile = ko.observable(false);

    var viewModel = {
        fiscaleOptions : function(){
            alert('ciao');
        },
        loadOptions:  {
                visible: loadPanelVisibile,
                showIndicator: true,
                showPane: true,                
                shading: true,
                closeOnOutsideClick: false, 
                shadingColor: "rgba(0,0,0,0.4)",
                position: { of: "body" }
            },
        title: title,
        save: function(){
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
            

            //invio tutti i dati al server previa correzione del campo dataNascita... id ecc
            data.dataNascitaTime = formInstance.getEditor('dataNascita').option('value'),
            data.id = lavoratore.id;

           
            var svc = new Fenealweb.services.lavoratoriService();
            svc.saveLavoratore(data)
            .done(function () {
                Fenealweb.app.currentViewModel = null;
                loadPanelVisibile(false);
                //se creo un nuovo elemento
                //vado direttemtne alla vista per il caricamento dei dati
                //altrimenti vado indietro
                if (updateOperation) {
                    Fenealweb.app.back();
                } else {
                   
                    Fenealweb.app.navigate({
                        view: 'lavoratore',
                        fiscale: data.fiscale
                    }, { target: 'current' });
                    
                }

               
               
                

            })
            .fail(function (error) {
                loadPanelVisibile(false);
                DevExpress.ui.notify(error, "error", 2500);
            });
           
        },
       
        formOptions: {
            colCount: 2,
            formData: lavoratore,

            items: [
                {
                    itemType: "group",
                    caption: "Dati anagrafici",
                    items: [
                       {
                           dataField: "nome",
                           editorOptions: {
                               placeholder: "Nome"
                           },
                           validationRules: [{
                               type: "required",
                               message: "Obbligatorio"
                           }]
                       },
                        {
                            dataField: "cognome",
                            editorOptions: {
                                placeholder: "Cognome"
                            },
                            validationRules: [{
                                type: "required",
                                message: "Obbligatorio"
                            }]
                        },
                       {
                           dataField: "dataNascita",
                           editorType: "dxDateBox",
                           editorOptions: {
                               displayFormat: "dd/MM/yyyy",
                               placeholder: 'Data nascita'
                           },
                           validationRules: [{
                               type: "required",
                               message: "Obbligatorio"
                           }]
                       },
                       {
                           dataField: "sesso",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource:sexList,
                               valueExpr: 'value',
                               displayExpr: 'label',
                               placeholder: 'Sesso',
                           },
                           validationRules: [{
                               type: "required",
                               message: "Obbligatorio"
                           }]
                       },
                       {
                           dataField: "nazione",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: new DevExpress.data.DataSource({
                                   load(loadOptions) {
                                       var a = new Fenealweb.services.commonsService();
                                       return a.getGeoNazioni();
                                   },
                                   byKey(key) {
                                       return $.Deferred().resolve(key).promise();
                                   }
                               }),
                               valueExpr: 'label',
                               displayExpr: 'label',
                               placeholder: 'Nazione',
                           },
                               validationRules: [{
                                   type: "required",
                                   message: "Obbligatorio"
                                }]
                       },
                       {
                           dataField: "provinciaNascita",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: new DevExpress.data.DataSource({
                                   load(loadOptions) {
                                       var a = new Fenealweb.services.commonsService();
                                       return a.getGeoProvinces();
                                   },
                                   byKey(key) {
                                       return $.Deferred().resolve(key).promise();
                                   }
                               }),
                               valueExpr: 'label',
                               displayExpr: 'label',
                               placeholder: 'Provincia nascita',
                               onValueChanged: function (e) {
                                   var idProvincia = e.value;
                                   //comuneValue('');
                                   var formInstance = $('#form').dxForm('instance');
                                   formInstance.getEditor('comuneNascita').option('value', '');
                                   comuniNascitaDataSource.searchValue(idProvincia);
                                   comuniNascitaDataSource.load();
                               },
                               value: geoProvinceNascitaSelected
                           }
                       },
                       {
                           dataField: "comuneNascita",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: comuniNascitaDataSource,
                               placeholder: 'Comune nascita',
                               valueExpr: 'label',
                               displayExpr: 'label',
                               value: comuneValue
                           }
                       },
                       {
                           dataField: "fiscale",
                           //template: function (data, itemElement) {

                           //    console.log(data);
                           //    var instance1 = $('<div>').dxTextBox({
                           //        value: data.editorOptions.value

                           //    });
                           //    var instance = $('<div>').dxButton({

                           //        text: 'ciao',
                           //        onClick: function () {
                           //            alert('cica ciao');
                           //        }
                           //    });

                           //    instance1.appendTo(itemElement);
                           //     instance.appendTo(itemElement);
                               
                           //},
                           editorOptions: {
                               placeholder: 'Codice fiscale'
                           },
                           validationRules: [{
                               type: "required",
                               message: "Obbligatorio"
                           }]
                       }]
                },
                 {
                     itemType: "group",
                     caption: "Residenza",
                     items: [
                        {
                            dataField: "provinciaResidenza",
                            editorType: "dxSelectBox",
                            editorOptions: {
                                dataSource: new DevExpress.data.DataSource({
                                    load(loadOptions) {
                                        var a = new Fenealweb.services.commonsService();
                                        return a.getGeoProvinces();
                                    },
                                    byKey(key) {
                                        return $.Deferred().resolve(key).promise();
                                    }
                                }),
                                valueExpr: 'label',
                                displayExpr: 'label',
                                placeholder: 'Provincia residenza',
                                onValueChanged: function (e) {
                                    var idProvincia = e.value;
                                    //comuneValue('');
                                    var formInstance = $('#form').dxForm('instance');
                                    formInstance.getEditor('comuneResidenza').option('value', '');
                                    comuniResidenzaDataSource.searchValue(idProvincia);
                                    comuniResidenzaDataSource.load();
                                },
                                value: geoProvinceNascitaSelected
                            }
                        },
                        {
                            dataField: "comuneResidenza",
                            editorType: "dxSelectBox",
                            editorOptions: {
                                dataSource: comuniResidenzaDataSource,
                                placeholder: 'Comune residenza',
                                valueExpr: 'label',
                                displayExpr: 'label',
                                value: comuneValue
                            }
                        },
                        {
                            dataField: "indirizzo",
                            editorOptions: {
                                placeholder: 'Indirizzo'
                            }
                        },
                        {
                            dataField: "cap",
                            editorOptions: {
                                placeholder: 'Cap'
                            }
                        }
                     ]
                 },
                {
                    itemType: "group",
                    caption: "Contatti",
                    items: [
                        {
                            dataField: "cellulare",
                            editorOptions: {
                                placeholder: 'Cellulare'
                            }
                        },
                        {
                            dataField: "telefono",
                            editorOptions: {
                                placeholder: 'Telefono'
                            }
                        },
                        {
                            dataField: "mail",
                            editorOptions: {
                                placeholder: 'Mail'
                            }
                        }
                    ]
                }
            ],


            
        },
        viewShown: function(e){
            Fenealweb.app.currentViewModel = e.viewInfo.model;
        }

    };

    return viewModel;
};