Fenealweb.azienda = function (params) {
    "use strict";


    //questa è la lista degli items nella navbar
    var navData = ko.observableArray([{
        text: "Azienda",
        icon: "user"
    }, {
        text: "Iscritti",
        icon: "fa fa-database",
        badge: 3
    }, {
        text: "Non iscritti",
        icon: "globe"
    }
    ]);


    var current = ko.observable({});
    var currentTab = ko.observable(0);

    var dataSourceIscrizioni = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var dataSourceNonIscritto = ko.observable(new DevExpress.data.DataSource({ store: [] }));
    var currentSelectedAzienda = ko.observable('');
    var currentSelectedLavoratore = ko.observable('');

    var viewModel = {
        //parametri actionsheet
        actionSheetData: [
            { text: "Vai al lavoratore" },
            //{ text: "Vai all'azienda" }
        ],
        actionSheetVisible: ko.observable(false),
        processSheetClick: function (e) {
            //document.location.href = 'tel:445546456';
            if (e.itemData.text == "Vai al lavoratore") {
                //navigo al lavoratore...
                Fenealweb.app.navigate({
                    view: 'lavoratore',
                    fiscale: currentSelectedLavoratore()
                });
                return;
            }
            //if (currentSelectedAzienda()) {
            //    Fenealweb.app.navigate({
            //        view: 'azienda',
            //        id: currentSelectedAzienda()
            //    });
            //} else {
            //    DevExpress.ui.notify("Azienda non presente", "error", 2500);
            //}
            
        },
        //queste sono le proprietà della navbar
        navData: navData,
        navSelectedIndex: currentTab,
        //queste csono le proprietà della lista degli iscritti
        iscrittiOptions: {
            dataSource: dataSourceIscrizioni,
            noDataText: 'Nessuna iscrizione trovata',
            //onItemSwipe: function (e) {
            //    DevExpress.ui.notify("swiped", "success", 1500);
            //},
            onItemClick: function (e) {
                var iscritto = e.itemData;
                currentSelectedLavoratore(iscritto.fiscale)

                viewModel.actionSheetVisible(true);
            }
        },
        nonIscrittiOptions: {
            dataSource: dataSourceNonIscritto,
            noDataText: 'Nessuna segnalazione trovata',
            onItemSwipe: function (e) {
                DevExpress.ui.notify("swiped", "success", 1500);
            },
            onItemClick: function (e) {
                var nonIscritto = e.itemData;
                currentSelectedAzienda(nonIscritto.azienda);
                currentSelectedLavoratore(nonIscritto.fiscale)
               
                viewModel.actionSheetVisible(true);
            }

        },
        //queste le proprietà di base
        title: ko.computed(function () {
            if (currentTab() == 0)
                return 'Azienda';
            else if (currentTab() == 1)
                return 'Iscritti';
            else if (currentTab() == 2)
                return 'Non iscritti';
        }),
        currentAzienda: current,
        dataReady: ko.observable(false),
        viewRendered: function () {
            var svc = new Fenealweb.services.aziendeService();
            svc.getAziendaById(params.id)
                .done(function (data) {
                    if (data.iscritti) {
                        navData()[1].badge = data.iscritti.length;
                        dataSourceIscrizioni(new DevExpress.data.DataSource(data.iscritti));
                    }

                    if (data.nonIscritti) {
                        navData()[2].badge = data.nonIscritti.length;
                        dataSourceNonIscritto(new DevExpress.data.DataSource(data.nonIscritti));
                    }



                    current(data);
                    viewModel.dataReady(true);



                })
                .fail(function (error) {
                    DevExpress.ui.notify(error, "error", 2500);
                    viewModel.dataReady(true);
                });

        },
        viewShown: function () {



        }



    };

    return viewModel;
};