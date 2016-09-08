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

    var viewModel = {

        //queste sono le proprietà della navbar
        navData: navData,
        navSelectedIndex: currentTab,
        //queste csono le proprietà della lista degli iscritti
        iscrittiOptions: {
            dataSource: dataSourceIscrizioni,
            noDataText: 'Nessuna iscrizione trovata',
            onItemSwipe: function (e) {
                DevExpress.ui.notify("swiped", "success", 1500);
            },
            onItemClick: function (e) {
                alert('clickkk');
            }
        },
        nonIscrittiOptions: {
            dataSource: dataSourceNonIscritto,
            noDataText: 'Nessuna segnalazione trovata',
            onItemSwipe: function (e) {
                DevExpress.ui.notify("swiped", "success", 1500);
            },

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