﻿Fenealweb.iscrizione = function (params) {
    "use strict";

    var iscrizione = params.id;

    var viewModel = {
        actionSheetData: [
          { text: "Vai all'azienda" }
        ],
        actionSheetVisible: ko.observable(false),
        iscrizione: iscrizione,
        navigaAzienda: function (e) {
            viewModel.actionSheetVisible(true);
        },
        processSheetClick: function (e) {
            Fenealweb.app.navigate({
                view: 'azienda',
                id: iscrizione.azienda
            });
        }
    };

    return viewModel;
};