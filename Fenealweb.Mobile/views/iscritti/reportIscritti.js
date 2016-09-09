Fenealweb.reportIscritti = function (params) {
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
    var tipoQuota = ko.observable('Quote associative');

    var selectedNazione = ko.observable('');
    var geoProvinceSelected = ko.observable('');
    var comuneValue = ko.observable('');
   
    
    var selectedSettore = ko.observable('EDILE');
    var selectedEnte = ko.observable('CASSA EDILE');
    var selectedAzienda = ko.observable('');


    var anniDa = ko.observable(new Date().getFullYear() - 1);
    var anniA = ko.observable(new Date().getFullYear());
    var mesiDa = ko.observable('Ottobre');
    var mesiA = ko.observable('Settembre');


    var viewModel = {
        search: function () {

             var searchParams = {
                    selectedProvincia: selectedProvincia,
                    tipoQuota: tipoQuota,
                    geoNazioneSelected : selectedNazione(),
                    geoProvinceSelected : geoProvinceSelected(),
                    geoComuneSelected: comuneValue(),
                    selectedSettore : selectedSettore(),
                    selectedEnte : selectedEnte(),
                    selectedAzienda : selectedAzienda(),
                    anniDa : anniDa(),
                    anniA : anniA(),
                    mesiDa : mesiDa(),
                    mesiA : mesiA(),
            };

            Fenealweb.app.navigate({
                view: 'iscrittiResult',
                id: searchParams
            });
        },
        aziendeLookupOptions: {
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
        settoriSelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getSettoriBase();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),
            placeholder: 'Settore...',
            value: selectedSettore,
        },
        anniDaSelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getListaAnniRiferimento();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),
            placeholder: 'Da anno...',
            value: anniDa,
        },
        tipoQuoteSelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getTipoQuote();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),
            placeholder: 'Tipo quota',
            value: tipoQuota,
        },
        mesiDaSelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getMesi();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),
            placeholder: 'Da mese...',
            value: mesiDa,
        },
        mesiASelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getMesi();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),
            placeholder: 'A mese...',
            value: mesiA,
        },
        anniASelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getListaAnniRiferimento();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),
            placeholder: 'A anno...',
            value: anniA,
        },
        provinceSelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getGeoProvinces();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),
            valueExpr: 'value',
            displayExpr: 'label',
            placeholder: 'Provincia residenza',
            onValueChanged: function (e) {
                var idProvincia = e.value;
                comuneValue('');
                comuniDataSource.searchValue(idProvincia);
                comuniDataSource.load();
            },
            value:geoProvinceSelected

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
            valueExpr: 'value',
            displayExpr: 'label',
            placeholder: 'Nazione',
            value: selectedNazione
        },
        comuniSelectOptions: {
            dataSource: comuniDataSource,
            placeholder: 'Comune residenza',
            valueExpr: 'value',
            displayExpr: 'label',
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
            });
        }


    };



    return viewModel;

};