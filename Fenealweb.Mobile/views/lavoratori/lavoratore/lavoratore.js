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
     }
    ]);

   
   


    var current = ko.observable({});
    var currentTab = ko.observable(0);

 
    var dataSourceIscrizioni = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var dataSourceNonIscritto = ko.observable(new DevExpress.data.DataSource({ store: [] }));

    var dataSourceDeleghe = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var dataSourceMagazzino = ko.observable(new DevExpress.data.DataSource({ store: [] }));


    var viewModel = {
        //queste sono le proprietà della navbar
        navData: navData,
        navSelectedIndex: currentTab,
        //queste csono le proprietà della lista dbNazionale
        dbNazionaleOptions:{
            dataSource: dataSourceIscrizioni,
            noDataText: 'Nessuna iscrizione trovata',
            onItemSwipe: function (e) {
                DevExpress.ui.notify("swiped", "success", 1500);
            },
            onItemClick: function (e) {

                var periodo = e.itemData.settore == "EDILE" ? e.itemData.periodo + ' - ' + e.itemData.anno : e.itemData.anno;

                e.itemData.completeName = viewModel.currentWorkerCompleteName();
                e.itemData.completePeriodo = periodo;
                e.itemData.showChevron = true,

                Fenealweb.app.navigate({
                    view: 'iscrizione',
                    id: e.itemData
                });
            }
        },
        delegheOptions: {
            dataSource: dataSourceDeleghe,
            noDataText: 'Nessuna delega trovata',
            onItemSwipe: function (e) {
                DevExpress.ui.notify("swiped", "success", 1500);
            },
            onItemClick: function (e) {

                e.itemData.showChevron = true,

                Fenealweb.app.navigate({
                    view: 'delega',
                    id: e.itemData
                });
            }
        },
        nonIscrittoOptions:{
            dataSource: dataSourceNonIscritto,
            noDataText: 'Nessuna segnalazione',
            onItemSwipe: function (e) {
                DevExpress.ui.notify("swiped", "success", 1500);
            },
            
        },
        magazzinoOptions: {
            dataSource: dataSourceDeleghe,
            noDataText: 'Nessuna delega in magazzino',
            onItemSwipe: function (e) {
                DevExpress.ui.notify("swiped", "success", 1500);
            },
            onItemClick: function (e) {

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
            
        }),
        currentWorker: current,
        currentWorkerCompleteName: function(){
            return current().nome.toUpperCase() + ' ' + current().cognome.toUpperCase();
        },
        smsClick: function(){
            alert('sms');
        },
        callClick: function () {
            alert('call');
        },
        tessereClick: function(){
            alert('tessera');
        },
        navigaAzienda: function(){
            alert('azienda');
        },
        dataReady: ko.observable(false),
        viewRendered: function () {
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
                        navData()[2].badge = data.deleghe.length;
                        dataSourceDeleghe(new DevExpress.data.DataSource(data.deleghe));
                    }


                    if (data.magazzino) {
                        navData()[4].badge = data.magazzino.length;
                        dataSourceMagazzino(new DevExpress.data.DataSource(data.magazzino));
                    }

                    current(data);
                    viewModel.dataReady(true);


                    
                })
                .fail(function (error) {
                    DevExpress.ui.notify(error, "error", 2500);
                    viewModel.dataReady(true);
                });
            
        },
        viewShown: function(){

           
           
        }


    };

    


    return viewModel;
};