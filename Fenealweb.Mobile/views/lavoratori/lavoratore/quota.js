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
            alert(quota.azienda);
        }
    };

    return viewModel;

};