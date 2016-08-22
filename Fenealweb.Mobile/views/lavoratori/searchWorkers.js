Fenealweb.searchWorkers = function (params) {
    "use strict";

    var cognome = ko.observable('');
    var nome = ko.observable('');
    var fiscale = ko.observable('');

    var viewModel = {
        search: function () {
            alert('cognome: ' + cognome() + ' nome: ' + nome() + ' fiscale: ' + fiscale() );
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