Fenealweb.quota = function (params) {
    "use strict";

    var quota = params.id;
    var viewModel = {
        quota: quota,
        actionSheetData: [
          { text: "Vai all'azienda" }
        ],
        actionSheetVisible: ko.observable(false),
       
        navigaAzienda: function (e) {
            viewModel.actionSheetVisible(true);
        },
        processSheetClick: function (e) {
            Fenealweb.app.navigate({
                view: 'azienda',
                id: quota.azienda
            });
        }
    };

    return viewModel;

};