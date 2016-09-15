Fenealweb.reportNonIscritti = function (params) {
    "use strict";

    var comuniDataSource = new DevExpress.data.DataSource({
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


    var selectedProvincia = ko.observable('');

    var selectedNazione = ko.observable('');
    var geoProvinceSelected = ko.observable('');
    var comuneValue = ko.observable('');

    var selectedEnte = ko.observable('CASSA EDILE');
    var selectedAzienda = ko.observable('');
    var selectedIscrittoA = ko.observable('');

   




    
    
    

    var viewModel = {
        search: function () {

            var searchParams = {
                selectedProvincia: selectedProvincia(),
                geoNazioneSelected: selectedNazione(),
                geoProvinceSelected: geoProvinceSelected(),
                geoComuneSelected: comuneValue(),
                iscrittoA: selectedIscrittoA(),
                selectedEnte: selectedEnte(),
                selectedAzienda: selectedAzienda(),
               
            };

            Fenealweb.app.navigate({
                view: 'nonIscrittiResult',
                id: searchParams
            });
        },
        aziendeLookupOptions:{
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
            
        },
        iscrittoASelectOptions:{
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getListaIscrittoA();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),
            placeholder:'Iscritto a...',
            value: selectedIscrittoA,
        },
        provinceSelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getGeoProvinces();
                },
                byKey(key) {
                    var lab = {
                        label: key
                    }
                    return $.Deferred().resolve(lab).promise();
                }
            }),
            valueExpr: 'label',
            displayExpr: 'label',
            placeholder: 'Provincia residenza',
           
            onValueChanged: function (e) {
                var idProvincia = e.value;
                comuneValue('');
                comuniDataSource.searchValue(idProvincia);
                comuniDataSource.load();
            },
            value: geoProvinceSelected

        },
        nazioniSelectOptions: {
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
            showClearButton: true,
            value: selectedNazione
        },
        comuniSelectOptions: {
            dataSource: comuniDataSource,
            placeholder: 'Comune residenza',
            valueExpr: 'label',
            displayExpr: 'label',
            showClearButton: true,
            value: comuneValue
        },

        provinceCasseEdiliSelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getListaProvince();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),

            value: selectedProvincia,
        },
        entiSelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getListaEntiBilaterali();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),

            value: selectedEnte,
        },
        viewShowing: function () {
            //prima di mostrare la vista recupeero il valore della prima provincia e lo imposto al valore della variabile selectedProvincia
            //solo cosi posso impostare un valore iniziale per la provincia
            var svc = new Fenealweb.services.commonsService();
            svc.getListaProvince().done(function (data) {
                selectedProvincia(data[0]);
                //impongo che nel report non iscrittti ci sia almeno la provincia di residenzxa come filtro
                geoProvinceSelected(data[0]);
            });
        }


    };



    return viewModel;
};