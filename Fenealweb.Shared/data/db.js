/// <reference path="../js/jquery-1.12.3.min.js" />
/// <reference path="../js/knockout-3.4.0.js" />
/// <reference path="../js/dx.all.js" />

(function () {

    // Enable partial CORS support for IE < 10    
    $.support.cors = true;

    var isWinJS = "WinJS" in window;
    function handleServiceError(error) {
        if (isWinJS) {
            try {
                new Windows.UI.Popups.MessageDialog(error.message).showAsync();
            } catch (e) {
                // Another dialog is shown
            }
        } else {
            alert(error.message);
        }
    }


    //*********************************************
    //*********************************************
    //creo una abstract Remote Store che contiene le funzionalità minime per le chiamate 
    //ai serivzi rest
    var AbstractRemoteStore = Fenealweb.core.AObject.extend({
        ctor: function () {
            AbstractRemoteStore.super.ctor.call(this);
        },
        prepareParams: function (params) {
            var d = $.Deferred();

            var tokenStore = new securityLocalStore();
            tokenStore.getToken().done(function (token) {
                params.token = token;
                d.resolve(params);
            });

            return d;

        },
        loadProtectedService: function (params) {
            var d = $.Deferred();
            var paramspromise = this.prepareParams(params);
            paramspromise.done(function (params) {

                var service = new Fenealweb.core.DBFactory();
                service.createService(params).load()
                    .done(function (data) {
                        d.resolve(data);
                    }).fail(function (error) {
                        d.reject(error);
                    });
            });

            return d;

        },
        loadService: function (params) {

            var service = new Fenealweb.core.DBFactory();
            return service.createService(params).load();

        }

    });

    //*********************************************
    //*********************************************

    //*********************************************
    //*********************************************
    //creo una classe per l'accesso al dbLocale per la verifica dell'esistenza delle credenziali
    //questa classe è necessaria perchè devo memorizzare le credenziali dell'utente quando l'app si chiude
    //con questa classe invio i dato nel local storage del browser. Tale classe ha metodi 
    //esclusivamente asincroni. 
    var securityLocalStore = Fenealweb.core.AObject.extend({
        ctor: function () {
            securityLocalStore.super.ctor.call(this);
            //ci saranno al max 2 items:
            //uno per lo username e la password
            //e l'altro per il token
            this.store = new DevExpress.data.LocalStore({
                name: "securityAccess",
                key: "id",
                errorHandler: handleServiceError
            });
        },
        getCredentials : function () {

            var d = $.Deferred();

            this.store.load().done(function (data) {


                if (!data) {
                    data = [];
                }
                if (data.length > 0)
                    d.resolve(data[0]);
                else
                    d.resolve(null);

            });


            return d.promise();
        },
        setCredentials : function (data, password) {

            var d = $.Deferred();

            var self = this;
            var insertCredResult;
            var insertTokenResult;
            //azzero lo store
            this.clearCredentials();
            //se esistono le aggiorno altirmenti ne creo una nuova
           

            //ne creo una nuova
            var cred = {
                id: 1,
                username: data.mail,
                password: password,
                company: data.company,
                role: data.role,
                name: data.name,
                surname: data.surname,
                completeName: data.name + ' ' + data.surname,
                provinces: data.provinces
            };

            var token = {
                id: 2,
                creationTimeStamp : new Date().getTime(),
                token: data.token
            };

            insertCredResult = self.store.insert(cred);
            insertTokenResult = self.store.insert(token);
            

            $.when(insertCredResult, insertTokenResult).done(function(){
                d.resolve();
            });
            
            return d.promise();

        },
        getToken : function () {
            var d = $.Deferred();

            this.store.load().done(function (data) {


                if (!data) {
                    data = [];
                }
                if (data.length == 2)
                    d.resolve(data[1]);
                else
                    d.resolve(null);

            });


            return d.promise();
        },
        setToken : function (token) {
            var self = this;
            var result;
            //verifico se già esiste
            //se esiste lo aggiorno altirmenti ne creo uno nuovo
            var tokenpromise = this.getToken();
            tokenpromise.done(function (data) {
                if (!data) {

                    //ne creo una nuova
                    var cred = {
                        id: 2,
                        creationTimeStamp : new Date().getTime(),
                        token: token
                    };
                    result = self.store.insert(cred);
                    return
                }
                data.token = token;
                creationTimeStamp: new Date().getTime(),
                result = self.store.update(2, data);

            });
            return result;
        },
        clearCredentials : function () {
            this.store.clear();
        }

       
    });

    //*********************************************
    //*********************************************





    //*********************************************
    //*********************************************
    //creo una classe per l'accesso al dbLocale per la verifica dell'esistenza delle credenziali
    var securityRemoteStore = AbstractRemoteStore.extend({
        ctor: function () {
            AbstractRemoteStore.super.ctor.call(this);
        },
        checkConnection : function () {

            var params = {
                route: 'connection'
            }

            return this.loadProtectedService(params);
        },
        freshToken : function () {

            var params = {
                route: 'freshToken'
            }
            return this.loadProtectedService(params);

        },
        login : function (username, password) {

            var params = {
                mail: username,
                password: password
            }
            var service = new Fenealweb.core.DBFactory();
            return service.createLoginService(params).load();
        
        }

    });
    
    //*********************************************
    //*********************************************


 

   



    Fenealweb.db = {};
    Fenealweb.db.securityLocalStore = securityLocalStore;
    Fenealweb.db.securityRemoteStore = securityRemoteStore;
}());
