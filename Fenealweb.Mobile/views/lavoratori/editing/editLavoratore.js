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
    //faccio diventare un observabile la stringa del codice fiscale
    lavoratore.fiscale = ko.observable(lavoratore.fiscale);

    var geoProvinceNascitaSelected = ko.observable(lavoratore.provinciaNascita);
    var comuneNascitaValue = ko.observable(lavoratore.comuneNascita);

    var geoProvinceResidenzaSelected = ko.observable(lavoratore.provinciaResidenza);
    var comuneResidenzaValue = ko.observable(lavoratore.comuneResidenza);

    var comuniNascitaDataSource = new DevExpress.data.DataSource({
        load(loadOptions) {

            if (!loadOptions.searchValue) {
                //se non cè un valore lo recupero dall'editor della provincia
                //solo se è nullo anche quello rispondo cin una trivial promise...
                var formInstance = $('#form').dxForm('instance');
                var prov = formInstance.getEditor('provinciaNascita').option('value');

                if (!prov) {
                    var d = $.Deferred();
                    return d.resolve([]).promise();
                }


                var a = new Fenealweb.services.commonsService();
                return a.getGeoComuni(prov);
            }
            var a = new Fenealweb.services.commonsService();
            return a.getGeoComuni(loadOptions.searchValue);
        },
        byKey(key) {
            var d = {
                label: key
            }
            return $.Deferred().resolve(d).promise();
        }
    });

    var comuniResidenzaDataSource = new DevExpress.data.DataSource({
        load(loadOptions) {

            if (!loadOptions.searchValue) {
                //se non cè un valore lo recupero dall'editor della provincia
                //solo se è nullo anche quello rispondo cin una trivial promise...
                var formInstance = $('#form').dxForm('instance');
                var prov = formInstance.getEditor('provinciaResidenza').option('value');

                if (!prov) {
                    var d = $.Deferred();
                    return d.resolve([]).promise();
                }


                var a = new Fenealweb.services.commonsService();
                return a.getGeoComuni(prov);
            }
            var a = new Fenealweb.services.commonsService();
            return a.getGeoComuni(loadOptions.searchValue);
        },
        byKey(key) {
            var d = {
                label: key
            }
            return $.Deferred().resolve(d).promise();
        }
    });
   
    var loadPanelVisibile = ko.observable(false);

    var viewModel = {
        cleanForm: function(){
            var formInstance = $('#form').dxForm('instance');
            formInstance.resetValues();
            formInstance.option('formData', lavoratore);
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
            data.dataNascitaTime = formInstance.getEditor('dataNascita').option('value');

            var dataNas = new Date(data.dataNascitaTime);
            var year = dataNas.getFullYear();
            var day = dataNas.getDate();
            var month = dataNas.getMonth() + 1; //da 0 a 11 deve essere corretto con il +1

            //adesso devo mettere in piedi una stringa del tipo dd/MM/yyyy
            var dayString = day < 10 ? '0' + day.toString() : day.toString();
            var monthString = month < 10 ? '0' + month.toString() : month.toString();

            data.dataNascita = dayString + "/" + monthString + "/" + year.toString();
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
                    //nel caso sto aggiornando devo fare attenzione a tornare indietro
                    //poichè la chiave di identificazione della vista è la descrizione dell'azienda e
                    //non il suo id. pertanto una varizaione della descrizione fa ripartire una query che se non trova
                    //la descrizione ne crea una nuova.... regola del server
                    if (lavoratore.fiscale != data.fiscale) {

                        ////rimuovo la vista precedetne dallla cache
                        //var cache = Fenealweb.app.viewCache;
                        //cache.removeView(previousViewKey);
                        Fenealweb.app.navigate({
                            view: 'lavoratore',
                            fiscale: data.fiscale
                        }, { target: 'back' });

                    } else {
                        Fenealweb.app.back();
                    }


                } else {
                    var fiscale = data.fiscale;
                    viewModel.cleanForm();
                    Fenealweb.app.navigate({
                        view: 'lavoratore',
                        fiscale: fiscale
                    }, { target: 'current' });
                    
                }

            })
            .fail(function (error) {
                loadPanelVisibile(false);
                DevExpress.ui.notify(error, "error", 2500);
            });
           
        },
        calcolaFiscale:function(){
            

            var inst = $('#form').dxForm('instance');
           // var formdata = inst.option('formData');

            var nome = inst.getEditor('nome').option('value');
            var cognome = inst.getEditor('cognome').option('value');
            var comuneNascita = inst.getEditor('comuneNascita').option('value');
            var dataNascita = inst.getEditor('dataNascita').option('value');
            var nazione = inst.getEditor('nazione').option('value');
            var sesso = inst.getEditor('sesso').option('value');



            loadPanelVisibile(true);

            //devo recuperare i dati per il calcolo del codice fiscale...
            var svc = new Fenealweb.services.lavoratoriService();
            svc.calculateFiscalCode(nome, cognome, comuneNascita, dataNascita, nazione, sesso)
            .done(function (data) {
                loadPanelVisibile(false);
                viewModel.lavoratoreData.fiscale(data);
            })
            .fail(function (error) {
                loadPanelVisibile(false);
                DevExpress.ui.notify(error, "error", 2500);
            });


        },
        lavoratoreData : lavoratore,
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
                                       var d = {
                                           label: key
                                       }
                                       return $.Deferred().resolve(d).promise();
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
                                       var d = {
                                           label: key
                                       }
                                       return $.Deferred().resolve(d).promise();
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
                               value: comuneNascitaValue
                           }
                       },
                       {
                           dataField: "fiscale",
                           template: 'fiscaleTemplate',
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
                                        var d = {
                                            label: key
                                        }
                                        return $.Deferred().resolve(d).promise();
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
                                value: geoProvinceResidenzaSelected
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
                                value: comuneResidenzaValue
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