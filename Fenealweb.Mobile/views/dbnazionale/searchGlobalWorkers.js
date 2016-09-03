Fenealweb.searchGlobalWorkers = function (params) {
    "use strict";

    var cognome = ko.observable('');
    var nome = ko.observable('');
    var fiscale = ko.observable('');

    var  comuniDataSource=  new DevExpress.data.DataSource({
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

    var comuneValue = ko.observable('');

    var viewModel = {
        search: function () {

            var searchParams = {
                cognome: cognome(),
                nome: nome(),
                fiscale: fiscale(),
                dbNazionaleSearch: true
            };

            if (!cognome() && !nome() && !fiscale()) {
                DevExpress.ui.notify("Selezionare almeno un criterio di ricerca", 'error', 3000);
                return;
            }

            Fenealweb.app.navigate({
                view: 'lavoratori',
                searchParams: searchParams
            });
        },
        cognomeOptions: {
            value: cognome, mode: 'search', showClearButton: true, placeholder: 'Cognome'
        },
        nomeOptions: {
            value: nome, mode: 'search', showClearButton: true, placeholder: 'Nome'
        },
        fiscaleOptions: {
            value: fiscale, mode: 'search', showClearButton: true, placeholder: 'Codice fiscale'
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
            }

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
            placeholder: 'Nazione'
        },
        comuniSelectOptions: {
            dataSource: comuniDataSource,
            placeholder: 'Comune residenza',
            valueExpr: 'value',
            displayExpr: 'label',
            value: comuneValue
        },
        
       
    };

  

    return viewModel;
};