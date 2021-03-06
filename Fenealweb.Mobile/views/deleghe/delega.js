﻿Fenealweb.delega = function (params) {
    "use strict";


    var delega = params.id;

    var viewModel = {
        actionSheetData: [
           { text: "Vai all'azienda" }
        ],
        actionSheetVisible: ko.observable(false),
        delega: delega,
        navigaAzienda: function (e) {
            viewModel.actionSheetVisible(true);
        },
        processSheetClick: function (e) {
            
            Fenealweb.app.navigate({
                view: 'azienda',
                id: delega.azienda
            });
           
            
        }
    };

    return viewModel;
};