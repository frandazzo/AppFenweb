Fenealweb.lavoratori = function (params) {
    "use strict";

    var cognome = params.cognome;
    var nome = params.nome;
    var fiscale = params.fiscale;

    function executeSearch() {

        var searchParams = {
            cognome: cognome,
            nome: nome,
            fiscale: fiscale
        };

        var svc = new Fenealweb.services.lavoratoriService();
        svc.searchLavoratori(searchParams).done(function (data) {

            //todo caricare la lista se ci sono elementi
           

            viewModel.searchIsReady(true);
        })
        .fail(function (error) {
            //mandare un messaggio di errore e visualizzare 
            viewModel.searchIsReady(true);
        });

    };



    var viewModel = {
        

        searchIsReady: ko.observable(false),
        viewShowing: function () {
            
        }


    };

    return viewModel;
};