Fenealweb.login = function (params) {
    "use strict";

    function checkFirstAccess () {

        var d = $.Deferred();
        //prima di avviare la navigazioneverifico la presenza delle credenziali
        //se presenti effettuo direttamente il login
        var localDb = new Fenealweb.db.securityLocalStore();
        localDb.getCredentials().done(function (data) {
            //se ci sono le credenziali effettuo il login direttamente da qui
            if (data) {
                var username = data.username;
                var pass = data.password;
                var secureRemoteAccessStore = new Fenealweb.services.securityService();
                secureRemoteAccessStore.login(username, pass).done(function (data) {

                    //se il login va a buon fine entro subito nella home
                   
                    Fenealweb.app.navigate({
                        view: 'home',
                        loggedUser: data
                    }, { root: true });

                }).fail(function (error) {
                    //altrimenti  la startup view rimane la login
                    localDb.clearCredentials();
                    d.resolve();
                });

                return;
            }
            d.resolve();
        });
        return d.promise();

    }



    var viewModel = {
        username: ko.observable('maurizio'),
        password: ko.observable('maurizio'),
        //in base al paramtro logout decido se effettuare un check di primo accesso oopure sto arrivando qui perchè ho cliccato
        //esci dallo slide out. Vedi metodo ExitApp in index.js
        modelIsReady: ko.observable(params.logout ? $.Deferred().resolve().promise() :checkFirstAccess()),
        login: function () {

            var sec = new Fenealweb.services.securityService()
            var promise = sec.login(viewModel.username(), viewModel.password());
            promise.done(function (data) {
                //posso navigare verso la home
                DevExpress.ui.notify("Benvenuto " + data.name + " " + data.surname, 'success', 600);
                Fenealweb.app.navigate({
                    view: 'home',
                    loggedUser: data
                }, { root: true });
            })
            .fail(function (error) {
                DevExpress.ui.notify(error, 'error', 2000);
            });


        }
       

    };

    return viewModel;
};