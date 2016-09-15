Fenealweb.nonIscrittiResult = function (params) {
    "use strict";


    var dataSource = new DevExpress.data.DataSource({
        pageSize:20,
        load(loadOptions) {
            var d = $.Deferred();
            loadOptions = $.extend(loadOptions, params.id);
            var a = new Fenealweb.services.reportService();
            a.reportNonIscritti(loadOptions).done(function (data) {

                if (data.length == 0) {
                    viewModel.title('Lista non iscritti');
                } else {
                    viewModel.title('Lista non iscritti' + ' (' + data[0].results  +')');
                }

                d.resolve(data);
            });

            return d.promise();
        },
        


    });

    
    var currentAzienda = ko.observable('');
    var currentLavoratore = ko.observable('');

    var viewModel = {
        actionSheetData: [
           { text: "Vai al lavoratore" },
           { text: "Vai all'azienda" }
        ],
        actionSheetVisible: ko.observable(false),
        //navigaLavoratore: function (e) {
        //    viewModel.actionSheetVisible(true);
        //},
        //navigaAzienda: function (e) {
        //    viewModel.actionSheetVisible(true);
        //},
        processSheetClick: function (e) {

            if (e.itemData.text == 'Vai al lavoratore') {
                Fenealweb.app.navigate({
                    view: 'lavoratore',
                    fiscale: currentLavoratore()
                });
            } else {
                if (currentAzienda()) {
                    Fenealweb.app.navigate({
                        view: 'azienda',
                        id: currentAzienda()
                    });
                }
                
            }


           
        },
        title:ko.observable('Lista non iscritti '),
        listOptions: {
            dataSource: dataSource,
            noDataText: 'Nessuna non iscrizione trovata!',

            onItemClick: function (e) {
                currentAzienda(e.itemData.azienda);
                currentLavoratore(e.itemData.fiscale);
                viewModel.actionSheetVisible(true);
            }
        }


    };

    return viewModel;
};