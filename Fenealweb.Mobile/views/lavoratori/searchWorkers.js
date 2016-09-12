Fenealweb.searchWorkers = function (params) {
    "use strict";

    var cognome = ko.observable('');
    var nome = ko.observable('');
    var fiscale = ko.observable('');

    

    var viewModel = {

        newLav:function(){

            var lav = {
                id: '0',
                nome: '',
                cognome: '',
                dataNascita: '',
                dataNascitaTime: 0,
                sesso: 'M',
                fiscale: '',
                nazione: '',
                provinciaResidenza: '',
                comuneResidenza: '',
                provinciaNascita: '',
                comuneNascita: '',
                indirizzo: '',
                cap: '',
                cellulare: '',
                telefono: '',
                mail:''

            };


            Fenealweb.app.navigate({
                view: 'editLavoratore',
                id: lav
            });

        },
        search: function () {

            var searchParams = {
                cognome: cognome(),
                nome: nome(),
                fiscale: fiscale()
            };

            if (!cognome() && !nome() && !fiscale()) {
                DevExpress.ui.notify("Selezionare almeno un criterio di ricerca", 'error', 3000);
                return;
            }

            Fenealweb.app.navigate({
                view: 'lavoratori',
                searchParams: searchParams
            });
        },
        cognomeOptions: {
            value: cognome, mode: 'search', showClearButton: true, placeholder: 'Cognome',
            onKeyDown: function (e) {
                if (e.jQueryEvent.keyCode === 13) {
                    document.activeElement.blur();
                }
            },
        },
        nomeOptions: {
            value: nome, mode: 'search', showClearButton: true, placeholder: 'Nome',
            onKeyDown: function (e) {
                if (e.jQueryEvent.keyCode === 13) {
                    document.activeElement.blur();
                }
            },
        },
        fiscaleOptions: {
            value: fiscale, mode: 'search', showClearButton: true, placeholder: 'Codice fiscale',
            onKeyDown: function (e) {
            if (e.jQueryEvent.keyCode === 13) {
                document.activeElement.blur();
            }
    },
        },
    };

    return viewModel;
};