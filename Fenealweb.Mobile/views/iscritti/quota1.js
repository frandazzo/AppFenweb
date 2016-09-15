Fenealweb.quota1 = function (params) {
    "use strict";

    var quota = params.id;
    var viewModel = {
        quota: quota,
        actionSheetData: [
            { text: "Vai al lavoratore" },
            { text: "Vai all'azienda" }
        ],
        actionSheetVisible: ko.observable(false),
        navigaLavoratore: function (e) {
            viewModel.actionSheetVisible(true);
        },
        navigaAzienda: function (e) {
            viewModel.actionSheetVisible(true);
        },
        processSheetClick: function (e) {

            if (e.itemData.text == 'Vai al lavoratore') {
                Fenealweb.app.navigate({
                    view: 'lavoratore',
                    fiscale: quota.fiscale
                });
            } else {
                if (quota.azienda) {
                    Fenealweb.app.navigate({
                        view: 'azienda',
                        id: quota.azienda
                    });
                }
                
            }


           
        }
    };

    return viewModel;
};