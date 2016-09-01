Fenealweb.home = function (params) {
    "use strict";

    
   
    //dati per il grafico della rappresentanza
    var dataSourceRappresentanza = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var titleRappresentanza = ko.observable('');
    var rappresentanzaChartVisible = ko.observable(true);
    var rappresentanzaNoDataText = ko.observable('');

    //dati per il grafico del terriotrio accorpato
    var dataSourceIscrittiTerritorioAccorpato = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var titleIscrittiTerritorioAccorpato = ko.observable('');

    //dati per il grafico dell'andamento iscritti per settore
    var dataSourceIscrittiPerSettore = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var titleIscrittiPerSettore = ko.observable('');


    //dati per il grafico dell'andamento iscritti per ente
    var dataSourceIscrittiPerEnte = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var titleIscrittiPerEnte = ko.observable('');
    //variabile globale per definire il valore delle serie per il grafico
    //tali valori saranno cambiati a runtime percio' una funzione asincrona li recupera e l'eventi ready del
    //container le associa al relativo grafico
    var enteSeries = [];

    //dati per il grafico dell'andamento iscritti per territorio accorpato
    var dataSourceIscrittiPerTA = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var titleIscrittiPerTA = ko.observable('test');
    //variabile globale per definire il valore delle serie per il grafico
    //tali valori saranno cambiati a runtime percio' una funzione asincrona li recupera e l'eventi ready del
    //container le associa al relativo grafico
    var taSeries = [];
    


    var data = JSON.parse(params.loggedUser.replace('json:', ''));
  
    //variabili per la selezione da popup dei dati di inizializzaizone dei grafici
    var selectedYear = ko.observable(new Date().getFullYear());
    var selectedEnte = ko.observable('CASSA EDILE');
    var selectedProvincia = ko.observable(data.provinces[0]);


    var provinceSelectVisible = ko.observable(true);
    var anniSelectVisible = ko.observable(true);
    var entiSelectVisible = ko.observable(true);

    //variabile per l'identificazione del grafico di cui si vogliono cambiare i 
    //paramtri
    var graficiArray = ['territorioAccorpato', 'andamentoTerritorioAccorpato', 'rappresentanza', 'andamentoSettore', 'andamentoEnte'];
    var currentGrafico = '';


    function getIscrittiTerritorioAccorpato(anno) {
        var svc = new Fenealweb.services.dashboardService();
        svc.getIscrittiTeritorioAccorpato(anno).done(function (data) {

            //todo
            //creare il grafico
            if (!data.data || data.data.length == 0) {
                titleIscrittiTerritorioAccorpato('Nessun dato disponibile. Anno: ' + data.anno);
                viewModel.iscrittiTerritorioAccorpatoReady(true);
                return;
            }
            
            dataSourceIscrittiTerritorioAccorpato(new DevExpress.data.DataSource({ store: data.data }));
            titleIscrittiTerritorioAccorpato('Anno: ' + data.anno);
            viewModel.iscrittiTerritorioAccorpatoReady(true);
        })
        .fail(function (error) {
            //mandare un messaggio di errore e visualizzare 
            viewModel.iscrittiTerritorioAccorpatoReady(true);
        });
    }
    function getRappresentanza(provincia, ente) {
        var svc = new Fenealweb.services.dashboardService();
        svc.getRappresentanza(provincia, ente).done(function (data) {

            //todo
            //creare il grafico

            if (!data.data || data.data.length == 0) {
                rappresentanzaChartVisible(false);
                rappresentanzaNoDataText('Nessun dato disponibile per ' + data.provincia + ' (' + data.ente + ')');
                viewModel.rappresentanzaReady(true);
                return;
            }
            rappresentanzaChartVisible(true);
            dataSourceRappresentanza(new DevExpress.data.DataSource({ store: data.data }));
            titleRappresentanza(data.provincia + ' (' + data.ente + ')');
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
            if (!data.data || data.data.length == 0) {
                titleIscrittiPerTA('Nessun dato disponibile.');
                viewModel.andamentoIscrittiTerritorioAccorpatoReady(true);
                return;
            }

            //prima di impostare il titolo e il datasource per il grafico
            //ne imposto le serie in dipendenza e rielaboro i risultati
            //ottenuti dal server:
            taSeries = data.series

           
            //dal server ottengo un array che contiene tutti gli anni
            //e una lista di righe dove per ogni riga si intende una serie definita nel campo name della riga
            //nella riga inoltre oltre al campo name cè la lista dei valori che la serie ha.
            //Attenzione. qui per serie (quella del server si intende una lista di valori per una entità definita
            //da nome 'name')


            dataSourceIscrittiPerTA(new DevExpress.data.DataSource({ store: data.data }));
            titleIscrittiPerTA('Riepilogo');
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
            if (!data.data || data.data.length == 0) {
                titleIscrittiPerSettore('Nessun dato disponibile. Territorio: ' + data.provincia);
                viewModel.andamentoIscrittiSettoreReady(true);
                return;
            }

            dataSourceIscrittiPerSettore(new DevExpress.data.DataSource({ store: data.data }));
            titleIscrittiPerSettore(data.provincia);
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


            if (!data.data || data.data.length == 0) {
                titleIscrittiPerSettore('Nessun dato disponibile. Territorio: ' + data.provincia);
                viewModel.andamentoIscrittiEnteReady(true);
                return;
            }

            //prima di impostare il titolo e il datasource per il grafico
            //ne imposto le serie in dipendenza e rielaboro i risultati
            //ottenuti dal server:
            enteSeries = data.series

            if (provincia) {
                //se non cè una provincia vuol dire che è la prima volta che entro nella funzione
                //e che quindi tale funzione è chiamata nel caricamento iniziale
                //se chiamassi queste righre di codice mi direbbe che il grafico non è inizializzato
                //e questo spiega il motivo dellevento onredered del dxdeferrendering widget
                var chartInstance = $("#perEnteChartContainer").dxChart('instance');
                chartInstance.option('series', enteSeries);
            }
            //dal server ottengo un array che contiene tutti gli anni
            //e una lista di righe dove per ogni riga si intende una serie definita nel campo name della riga
            //nella riga inoltre oltre al campo name cè la lista dei valori che la serie ha.
            //Attenzione. qui per serie (quella del server si intende una lista di valori per una entità definita
            //da nome 'name')


            dataSourceIscrittiPerEnte(new DevExpress.data.DataSource({ store: data.data }));
            titleIscrittiPerEnte(provincia);
            viewModel.andamentoIscrittiEnteReady(true);
        })
        .fail(function (error) {
            //mandare un messaggio di errore e visualizzare 
            viewModel.andamentoIscrittiEnteReady(true);
        });
    }
  


    var viewModel = {
        //view model per il grafico di rappresentanza e rappresentatività
        //************************************
        rappresentanzaChartVisible: rappresentanzaChartVisible,
        rappresentanzaNoDataText: rappresentanzaNoDataText,
        rappresentanzaChartOptions: {
            dataSource: dataSourceRappresentanza,
            title: titleRappresentanza,
            legend: {
                orientation: "horizontal",
                itemTextPosition: "center",
                horizontalAlignment: "center",
                verticalAlignment: "bottom",
                columnCount: 3,
                customizeText: function (pointInfo) {
                    //return pointInfo.pointName + ' - ' + dataSource1.filter(function (elem) {
                    //    return elem.country === pointInfo.pointName
                    //})[0].medals;
                    

                    var pieChart = $("#pierappresentanza").dxPieChart('instance');
                    var point = pieChart.getAllSeries()[0].getAllPoints()[pointInfo.pointIndex];
                    return pointInfo.pointName + ' ' + point.originalValue + ' iscr.';
                    //var percentValue = (pieChart.getAllSeries()[0].getAllPoints()[pointInfo.pointIndex].percent * 100).toFixed(2);

                    //return pointInfo.pointName + ": " + percentValue + '%';


                }
            },
            "export": {
                enabled: false
            },
            series: [{
                argumentField: "sindacato",
                valueField: "iscritti",
                label: {
                    visible: true,
                    font: {
                        size: 16
                    },
                    connector: {
                        visible: true,
                        width: 0.5
                    },
                    position: "inside",
                    customizeText: function (arg) {

                        var percentValue = (arg.percent * 100).toFixed(2);

                        return percentValue + "%";
                    }
                    
                }
            }]
        },
        rappresentanzaReady: ko.observable(false),
        rappresentanzaChangeParams: function (e) {

            provinceSelectVisible(true);
            anniSelectVisible(false)
            entiSelectVisible(true);
            currentGrafico = graficiArray[2];
            this.changeParamsPopupTitle('Rappresentanza e sindacalizzazione');
            this.changeParamsPopupVisible(true);
        },
        //************************************
        loggedUser: data,
        completeName : ko.computed(function(){
            return data.name + " " + data.surname;
        }),
        //grafico iscritti territorio accorpato
        //***************************************************
        iscrittiTerritorioAccorpatoReady: ko.observable(false),
        iscrittiTerritorioAccorpatoChangeParams: function (e) {
           
            provinceSelectVisible(false);
            anniSelectVisible(true)
            entiSelectVisible(false);

            currentGrafico = graficiArray[0];
            this.changeParamsPopupTitle('Iscritti per territori accorpati');
            this.changeParamsPopupVisible(true);
        },
        iscrittiTerritorioAccorpatoChartOptions: {
            dataSource: dataSourceIscrittiTerritorioAccorpato,
            title: titleIscrittiTerritorioAccorpato,
            legend: {
                orientation: "horizontal",
                itemTextPosition: "center",
                horizontalAlignment: "center",
                verticalAlignment: "bottom",
                columnCount: 3,
                customizeText: function (pointInfo) {
                    //return pointInfo.pointName + ' - ' + dataSource1.filter(function (elem) {
                    //    return elem.country === pointInfo.pointName
                    //})[0].medals;


                    var pieChart = $("#pieterraccorpato").dxPieChart('instance');
                    var point = pieChart.getAllSeries()[0].getAllPoints()[pointInfo.pointIndex];
                    return pointInfo.pointName + ' ' + point.originalValue + ' iscr.';
                    //var percentValue = (pieChart.getAllSeries()[0].getAllPoints()[pointInfo.pointIndex].percent * 100).toFixed(2);

                    //return pointInfo.pointName + ": " + percentValue + '%';


                }
            },
            "export": {
                enabled: false
            },
            series: [{
                argumentField: "territorio",
                valueField: "iscritti",
                label: {
                    visible: true,
                    font: {
                        size: 16
                    },
                    connector: {
                        visible: true,
                        width: 0.5
                    },
                    position: "inside",
                    customizeText: function (arg) {

                        var percentValue = (arg.percent * 100).toFixed(2);

                        return percentValue + "%";
                    }

                }
            }]
        },
        //***************************************************


        andamentoIscrittiTerritorioAccorpatoReady: ko.observable(false),
        onRenderedTA: function (e) {
            var chartInstance = $("#perTerritorioAccorpatoChartContainer").dxChart('instance');
            chartInstance.option('series', taSeries);
        },
        andamentoIscrittiTAChartOptions: {
            dataSource: dataSourceIscrittiPerTA,
            commonSeriesSettings: {
                argumentField: "anno",
                type: "bar",
                hoverMode: "allArgumentPoints",
                selectionMode: "allArgumentPoints",
                label: {
                    visible: true,

                }
            },
            series: [
                //non metto nessuna serie perche verrà calcolata a runtime
                //non appena recupero i dati da visualizzare nel grafico

            ],
            title: titleIscrittiPerTA,
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            },
            "export": {
                enabled: false
            }
        },
        //andamentoIscrittiTerritorioAccorpatoChangeParams: function (e) {

        //    //currentGrafico = graficiArray[1];
        //    //this.changeParamsPopupTitle('Andamento iscritti per territori accorpati');
        //    //this.changeParamsPopupVisible(true);
        //},


        //dati per il grafico degli iscritti per settore
        //***************************************************
        andamentoIscrittiSettoreReady: ko.observable(false),
        andamentoIscrittiSettoreChangeParams: function (e) {

            provinceSelectVisible(true);
            anniSelectVisible(false)
            entiSelectVisible(false);

            currentGrafico = graficiArray[3];
            this.changeParamsPopupTitle('Andamento iscritti per settore');
            this.changeParamsPopupVisible(true);
        },
        andamentoIscrittiSettoreChartOptions: {
            dataSource: dataSourceIscrittiPerSettore,
            commonSeriesSettings: {
                argumentField: "anno",
                type: "bar",
                hoverMode: "allArgumentPoints",
                selectionMode: "allArgumentPoints",
                label: {
                    visible: true,
                    
                }
            },
            series: [
                { valueField: "edile", name: "Edile" },
                { valueField: "impiantiFissi", name: "Impianti fissi"},
                { valueField: "inps", name: "Inps" }
            ],
            title: titleIscrittiPerSettore,
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            },
            "export": {
                enabled: false
            }
        },
       
        //***************************************************

     

        onRendered: function (e) {
            var chartInstance = $("#perEnteChartContainer").dxChart('instance');
            chartInstance.option('series', enteSeries);
        },
        andamentoIscrittiEnteReady: ko.observable(false),
        andamentoIscrittiEnteChangeParams: function (e) {
            provinceSelectVisible(true);
            anniSelectVisible(false)
            entiSelectVisible(false);
            currentGrafico = graficiArray[4];
            this.changeParamsPopupTitle('Andamento iscritti per ente');
            this.changeParamsPopupVisible(true);
        },
        andamentoIscrittiEnteChartOptions: {
            dataSource: dataSourceIscrittiPerEnte,
            commonSeriesSettings: {
                argumentField: "anno",
                type: "bar",
                hoverMode: "allArgumentPoints",
                selectionMode: "allArgumentPoints",
                label: {
                    visible: true,

                }
            },
            series: [
                //non metto nessuna serie perche verrà calcolata a runtime
                //non appena recupero i dati da visualizzare nel grafico
               
            ],
            title: titleIscrittiPerEnte,
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            },
            "export": {
                enabled: false
            }
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
            visible: provinceSelectVisible,
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
            visible: entiSelectVisible,
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
            visible: anniSelectVisible,
            
        },
        provinceSelectVisible :provinceSelectVisible,
        anniSelectVisible : anniSelectVisible,
        entiSelectVisible : entiSelectVisible,

        //gestione del popup per settera i parametri di un grafcio
        //************************************
        changeParamsPopupVisible: ko.observable(false),
        changeParamsPopupTitle: ko.observable(''),
        hidePopup: function () {
            this.changeParamsPopupVisible(false);
        },
        //************************************
        reloadWidget: function () {

            this.changeParamsPopupVisible(false);

            if (currentGrafico == graficiArray[0]) {
                viewModel.iscrittiTerritorioAccorpatoReady(false);
                getIscrittiTerritorioAccorpato(selectedYear());
            } else if (currentGrafico == graficiArray[1]) {
                viewModel.andamentoIscrittiTerritorioAccorpatoReady(false);
                getAndamentoIscrittiTerritorioAccorpato();
            } else if (currentGrafico == graficiArray[2]) {
                viewModel.rappresentanzaReady(false);
                getRappresentanza(selectedProvincia(), selectedEnte());
            } else if (currentGrafico == graficiArray[3]) {
                viewModel.andamentoIscrittiSettoreReady(false);
                getAndamentoIscrittiSettore(selectedProvincia());
            } else if (currentGrafico == graficiArray[4]) {
                viewModel.andamentoIscrittiEnteReady(false);
                getAndamentoIscrittiEnte(selectedProvincia());
            }

        },
        viewRendered: function () {
            getIscrittiTerritorioAccorpato();
            getAndamentoIscrittiTerritorioAccorpato();
            getRappresentanza();
            getAndamentoIscrittiSettore();
            getAndamentoIscrittiEnte()
        }

    };

    return viewModel;
};

