Fenealweb.searchWorkers = function (params) {
    "use strict";

    var cognome = ko.observable('');
    var nome = ko.observable('');
    var fiscale = ko.observable('');

    var viewModel = {
        search: function () {

            if (!cognome() && !nome() && !fiscale()) {
                DevExpress.ui.notify("Selezionare almeno un criterio di ricerca", 'error', 3000);
                return;
            }

            Fenealweb.app.navigate({
                view: 'lavoratori'
            });
        },
        cognomeOptions:{
            value: cognome, mode: 'search', showClearButton: true
        },
        nomeOptions: {
            value : nome, mode: 'search', showClearButton: true
        },
        fiscaleOptions: {
            value: fiscale, mode: 'search', showClearButton: true
        },
    };

    return viewModel;
};