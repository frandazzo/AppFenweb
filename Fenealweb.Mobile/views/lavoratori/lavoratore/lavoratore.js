Fenealweb.lavoratore = function (params) {
    "use strict";

    //questa è la lista degli items nella navbar
    var navData = ko.observableArray([{
        text: "Lavoratore",
        icon: "user"
    }, {
        text: "Db nazionale",
        icon: "fa fa-database",
        badge: 3
    }, {
        text: "Deleghe",
        icon: "folder"
    },
     {
         text: "Non iscritto",
         icon: "globe"
     },
     {
         text: "Mag. deleghe",
         icon: "tags"
     },
     {
         text: "Quote versate",
         icon: "fa fa-eur"
     }
    ]);

    var numDeleghe = 0;
    var numDelegheMagazzino = 0;
   
    function loadData(callback) {
        viewModel.dataReady(false);
        var svc = new Fenealweb.services.lavoratoriService();
        svc.getLavoratoreByFiscalCode(params.fiscale)
            .done(function (data) {
                if (data.iscrizioni) {
                    navData()[1].badge = data.iscrizioni.length;
                    dataSourceIscrizioni(new DevExpress.data.DataSource(data.iscrizioni));
                }

                if (data.nonIscrizioni) {
                    navData()[3].badge = data.nonIscrizioni.length;
                    dataSourceNonIscritto(new DevExpress.data.DataSource(data.nonIscrizioni));
                }

                if (data.deleghe) {
                    numDeleghe = data.deleghe.length;
                    navData()[2].badge = data.deleghe.length;
                    dataSourceDeleghe(new DevExpress.data.DataSource(data.deleghe));
                }


                if (data.magazzino) {
                    numDelegheMagazzino = data.magazzino.length;
                    navData()[4].badge = data.magazzino.length;
                    dataSourceMagazzino(new DevExpress.data.DataSource(data.magazzino));
                }


                if (data.quote) {
                    navData()[5].badge = data.quote.length;
                    dataSourceQuote(new DevExpress.data.DataSource(data.quote));
                }

                current(data);
                viewModel.dataReady(true);

                if (callback)
                    callback();

            })
            .fail(function (error) {
                DevExpress.ui.notify(error, "error", 2500);
                viewModel.dataReady(true);
            });
    }

    var current = ko.observable(null);
    var currentTab = ko.observable(0);

 
    var dataSourceIscrizioni = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var dataSourceNonIscritto = ko.observable(new DevExpress.data.DataSource({ store: [] }));

    var dataSourceDeleghe = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var dataSourceMagazzino = ko.observable(new DevExpress.data.DataSource({ store: [] }));

    var dataSourceQuote = ko.observable(new DevExpress.data.DataSource({ store: [] }));

    var currentSelectedAzienda = ko.observable('');

    var viewModel = {

        //comandi
        nuovaDelegaMag: function () {

            var delega = {
                id: 0,
                provincia: undefined,        
                ente: undefined,
                collaboratore: undefined,
                idLavoratore: current().id,
                fiscale: current().fiscale
            }

            Fenealweb.app.navigate({
                view: 'editMagDelega',
                id: delega
            });

        },
        nuovaDelega: function () {

            var delega = {
                id: 0,
                provincia: undefined,
                causaleIscrizione: undefined,
                settore: undefined,
                ente: undefined,
                azienda: undefined,
                collaboratore: undefined,
                idLavoratore: current().id,
                fiscale : current().fiscale
            }

            Fenealweb.app.navigate({
                view: 'editDelega',
                id: delega
            });
        },
        nuovaRicerca: function(){
            Fenealweb.app.navigate({
                    view: 'searchWorkers'
            }, {
                root:true
            });
        },
        modifica:function(){
            Fenealweb.app.navigate({
                view: 'editLavoratore',
                id: current()
            });
        },
        //parametri actionsheet
        actionSheetData: [
            { text: "Vai all'azienda" }
        ],
        actionSheetVisible: ko.observable(false),
        processSheetClick: function (e) {
            //document.location.href = 'tel:445546456';

        
            Fenealweb.app.navigate({
                view: 'azienda',
                id: currentSelectedAzienda()
            });
           
          
        },
        //paramtri popup
        changeParamsPopupVisible: ko.observable(false),
        hidePopup: function(){
            viewModel.changeParamsPopupVisible(false);
        },
        stampeTesseraLavoratore: ko.computed(function () {
            if (!current())
                return '';
            if (!current().stampeTessera)
                return 'Nessuno';
            if (current().stampeTessera.length == 0)
                return 'Nessuno';
            return current().stampeTessera.join(', ');

        }),
        //queste sono le proprietà della navbar
        navData: navData,
        navSelectedIndex: currentTab,
        //queste csono le proprietà della lista dbNazionale
        dbNazionaleOptions:{
            dataSource: dataSourceIscrizioni,
            noDataText: 'Nessuna iscrizione trovata',
            //onItemSwipe: function (e) {
            //    DevExpress.ui.notify("swiped", "success", 1500);
            //},
            onItemClick: function (e) {

                var periodo = e.itemData.settore == "EDILE" ? e.itemData.periodo + ' - ' + e.itemData.anno : e.itemData.anno;

                e.itemData.completeName = viewModel.currentWorkerCompleteName();
                e.itemData.completePeriodo = periodo;
                e.itemData.showChevron = true

                Fenealweb.app.navigate({
                    view: 'iscrizione',
                    id: e.itemData
                });
            }
        },
        delegheOptions: {
           
            dataSource: dataSourceDeleghe,
            noDataText: 'Nessuna delega trovata',
            allowItemDeleting: true,
            itemDeleteMode: 'slideItem',
            onItemDeleted: function(data) {
                var delega = data.itemData;

                numDeleghe = numDeleghe - 1;
                navData()[2].badge = numDeleghe == 0 ? '' : numDeleghe;


                var ss = $('#nav1').dxNavBar('instance');
                ss.option('dataSource', navData());


                var svc = new Fenealweb.services.lavoratoriService();
                svc.deleteDelega(delega.id).done(function () {

                    DevExpress.ui.notify("Operazione conclusa correttamente", "success", 2500);

                }).fail(function(error){
                    DevExpress.ui.notify(error, "error", 2500);
                });

            },
            //onItemSwipe: function (e) {
            //    DevExpress.ui.notify("swiped", "success", 1500);
            //},
            onItemClick: function (e) {
                e.itemData.completeName = viewModel.currentWorkerCompleteName();
                e.itemData.showChevron = true

                Fenealweb.app.navigate({
                    view: 'delega',
                    id: e.itemData
                });
            }
        },
        quoteOptions: {
            dataSource: dataSourceQuote,
            noDataText: 'Nessuna quota trovata',
            //onItemSwipe: function (e) {
            //    DevExpress.ui.notify("swiped", "success", 1500);
            //},
            onItemClick: function (e) {
                e.itemData.completeName = viewModel.currentWorkerCompleteName();
                

                Fenealweb.app.navigate({
                    view: 'quota',
                    id: e.itemData
                });
            }
        },
        nonIscrittoOptions:{
            dataSource: dataSourceNonIscritto,
            noDataText: 'Nessuna segnalazione',
            ////onItemSwipe: function (e) {
            ////    DevExpress.ui.notify("swiped", "success", 1500);
            ////},
            onItemClick: function (e) {
                currentSelectedAzienda(e.itemData.azienda);
                viewModel.actionSheetVisible(true);
            }
            
        },
        magazzinoOptions: {
            dataSource: dataSourceMagazzino,
            noDataText: 'Nessuna delega in magazzino',
            allowItemDeleting: true,
            itemDeleteMode: 'slideItem',
            onItemDeleted: function (data) {
                var delega = data.itemData;
               

                numDelegheMagazzino = numDelegheMagazzino - 1;
                navData()[4].badge = numDelegheMagazzino == 0 ? '' : numDelegheMagazzino;
                
                var ss = $('#nav1').dxNavBar('instance');
                ss.option('dataSource', navData());




                

                var svc = new Fenealweb.services.lavoratoriService();
                svc.deleteMagazzinoDelega(delega.id).done(function () {

                    DevExpress.ui.notify("Operazione conclusa correttamente", "success", 2500);

                }).fail(function (error) {
                    DevExpress.ui.notify(error, "error", 2500);
                });
               
               
            },
            //onItemSwipe: function (e) {
            //    DevExpress.ui.notify("swiped", "success", 1500);
            //},
            onItemClick: function (e) {
                e.itemData.completeName = viewModel.currentWorkerCompleteName();
                e.itemData.showChevron = true,

                Fenealweb.app.navigate({
                    view: 'magazzino',
                    id: e.itemData
                });
            }
        },
        //queste le proprietà di base
        title: ko.computed(function () {
            if (currentTab()== 0)
                return 'Lavoratore';
            else if(currentTab() == 1)
                return 'Db Nazionale';
            else if (currentTab() == 2)
                return 'Deleghe';
            else if (currentTab() == 3)
                return 'Non iscrizioni';
            else if (currentTab() == 4)
                return 'Mag. deleghe';
            else if (currentTab() == 5)
                return 'Quote versate';
            
        }),
        currentWorker: current,
        currentWorkerCompleteName: function () {
            if (!current())
                return '';
            return current().nome.toUpperCase() + ' ' + current().cognome.toUpperCase();
        },
        //smsClick: function(){
        //    alert('sms');
        //},
        //callClick: function () {
        //    alert('call');
        //},
        tessereClick: function(){
            viewModel.changeParamsPopupVisible(true);
        },
        navigaAzienda: function () {
            currentSelectedAzienda(current().iscrizioneCorrente.azienda)
            viewModel.actionSheetVisible(true);
        },
        dataReady: ko.observable(false),
        viewRendered: function () {
            loadData();
            
        },
        viewShown: function(e){

            if (e.direction == 'backward') {
                //se sto venendo dalla maschera di edit allora posso ricarficare...
                //....se necessario
                loadData(function () {
                    var ss = $('#nav1').dxNavBar('instance');
                    ss.option('dataSource', navData());
                });
               
            }
           
        }


    };

    


    return viewModel;
};