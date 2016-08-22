Fenealweb.home = function (params) {
    "use strict";


    var data = JSON.parse(params.loggedUser.replace('json:', ''));
  
    //variabili per la selezione da popup dei dati di inizializzaizone dei grafici
    var selectedYear = ko.observable(new Date().getFullYear());
    var selectedEnte = ko.observable('CASSA EDILE');
    var selectedProvincia = ko.observable(data.provinces[0]);

    //variabile per l'identificazione del grafico di cui si vogliono cambiare i 
    //paramtri
    var graficiArray = ['territorioAccorpato', 'andamentoTerritorioAccorpato', 'rappresentanza', 'andamentoSettore', 'andamentoEnte'];
    var currentGrafico = '';


    function getIscrittiTerritorioAccorpato(anno) {
        var svc = new Fenealweb.services.dashboardService();
        svc.getIscrittiTeritorioAccorpato(anno).done(function (data) {

            //todo
            //creare il grafico

            viewModel.iscrittiTerritorioAccorpatoReady(true);
        })
        .fail(function (error) {
            //mandare un messaggio di errore e visualizzare 
            viewModel.iscrittiTerritorioAccorpatoReady(true);
        });
    }
    function getRappresentanza(anno, ente) {
        var svc = new Fenealweb.services.dashboardService();
        svc.getRappresentanza(anno, ente).done(function (data) {

            //todo
            //creare il grafico

            viewModel.rappresentanzaReady(true);
        })
        .fail(function (error) {
            //mandare un messaggio di errore e visualizzare 
            viewModel.rappresentanzaReady(true);
        });
    }

    function getAndamentoIscrittiTerritorioAccorpato() {
        var svc = new Fenealweb.services.dashboardService();
        svc.getAndamentoIscrittiTerritorioAccorpato().done(function (data) {

            //todo
            //creare il grafico

            viewModel.andamentoIscrittiTerritorioAccorpatoReady(true);
        })
        .fail(function (error) {
            //mandare un messaggio di errore e visualizzare 
            viewModel.andamentoIscrittiTerritorioAccorpatoReady(true);
        });
    }

    function getAndamentoIscrittiSettore(provincia) {
        var svc = new Fenealweb.services.dashboardService();
        svc.getAndamentoIscrittiSettore(provincia).done(function (data) {

            //todo
            //creare il grafico

            viewModel.andamentoIscrittiSettoreReady(true);
        })
        .fail(function (error) {
            //mandare un messaggio di errore e visualizzare 
            viewModel.andamentoIscrittiSettoreReady(true);
        });
    }

    function getAndamentoIscrittiEnte(provincia) {
        var svc = new Fenealweb.services.dashboardService();
        svc.getAndamentoIscrittiEnte(provincia).done(function (data) {

            //todo
            //creare il grafico

            viewModel.andamentoIscrittiEnteReady(true);
        })
        .fail(function (error) {
            //mandare un messaggio di errore e visualizzare 
            viewModel.andamentoIscrittiEnteReady(true);
        });
    }


    var viewModel = {

        loggedUser: data,
        completeName : ko.computed(function(){
            return data.name + " " + data.surname;
        }),
        iscrittiTerritorioAccorpatoReady: ko.observable(false),
        iscrittiTerritorioAccorpatoChangeParams: function (e) {
           
            currentGrafico = graficiArray[0];
            this.changeParamsPopupTitle('Iscritti per territori accorpati');
            this.changeParamsPopupVisible(true);
        },

        andamentoIscrittiTerritorioAccorpatoReady: ko.observable(false),
        andamentoIscrittiTerritorioAccorpatoChangeParams: function (e) {

            //currentGrafico = graficiArray[1];
            //this.changeParamsPopupTitle('Andamento iscritti per territori accorpati');
            //this.changeParamsPopupVisible(true);
        },


        andamentoIscrittiSettoreReady: ko.observable(false),
        andamentoIscrittiSettoreChangeParams: function (e) {

            currentGrafico = graficiArray[3];
            this.changeParamsPopupTitle('Andamento iscritti per settore');
            this.changeParamsPopupVisible(true);
        },

        andamentoIscrittiEnteReady: ko.observable(false),
        andamentoIscrittiEnteChangeParams: function (e) {

            currentGrafico = graficiArray[4];
            this.changeParamsPopupTitle('Andamento iscritti per ente');
            this.changeParamsPopupVisible(true);
        },

        rappresentanzaReady: ko.observable(false),
        rappresentanzaChangeParams: function (e) {

            currentGrafico = graficiArray[2];
            this.changeParamsPopupTitle('Rappresentanza e sindacalizzazione');
            this.changeParamsPopupVisible(true);
        },

        provinceSelectOptions: {
            //onInitialized: function (e) {
            //    var instance = e.component;
            //    p = instance;
            //    //var items = instance.option('items');
            //    //selectedProvincia(items[0]);
              
            //},
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
            visible: ko.observable(true),
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
            visible: ko.observable(true),
        },
        anniSelectOptions: {
            dataSource: new DevExpress.data.DataSource({
                load(loadOptions) {
                    var a = new Fenealweb.services.commonsService();
                    return a.getListaAnniRiferimento();
                },
                byKey(key) {
                    return $.Deferred().resolve(key).promise();
                }
            }),
            
            value: selectedYear,
            visible: ko.observable(true),
            
        },
        changeParamsPopupVisible: ko.observable(false),
        changeParamsPopupTitle: ko.observable(''),
        hidePopup: function () {
            this.changeParamsPopupVisible(false);
        },
        reloadWidget: function () {

            this.changeParamsPopupVisible(false);

            if (currentGrafico == graficiArray[0]) {
                viewModel.iscrittiTerritorioAccorpatoReady(false);
                getIscrittiTerritorioAccorpato(selectedYear);
            } else if (currentGrafico == graficiArray[1]) {
                viewModel.andamentoIscrittiTerritorioAccorpatoReady(false);
                getAndamentoIscrittiTerritorioAccorpato();
            } else if (currentGrafico == graficiArray[2]) {
                viewModel.rappresentanzaReady(false);
                getRappresentanza(selectedYear, selectedEnte);
            } else if (currentGrafico == graficiArray[3]) {
                viewModel.andamentoIscrittiSettoreReady(false);
                getAndamentoIscrittiSettore(selectedProvincia);
            } else if (currentGrafico == graficiArray[4]) {
                viewModel.andamentoIscrittiEnteReady(false);
                getAndamentoIscrittiEnte(selectedProvincia);
            }

        },
        viewShowing: function () {
            getIscrittiTerritorioAccorpato();
            getAndamentoIscrittiTerritorioAccorpato();
            getRappresentanza();
            getAndamentoIscrittiSettore();
            getAndamentoIscrittiEnte()
        }

    };

  




   


    return viewModel;
};