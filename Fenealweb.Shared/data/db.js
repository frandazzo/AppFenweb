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
    //creo una abstract Remote Store che contiene le funzionalit� minime per le chiamate 
    //ai serivzi rest
    var AbstractRemoteStore = Fenealweb.core.AObject.extend({
        ctor: function () {
            AbstractRemoteStore.super.ctor.call(this);
        },
        prepareParams: function (params) {
            var d = $.Deferred();

            //var tokenStore = new securityLocalStore();
            //tokenStore.getToken().done(function (token) {
            //    params.token = token;
            //    d.resolve(params);
            //});

            //return d;
            
            //qui devo verificare la validit� del token
            //se il login lo ho effettuato piu di venti minuti fa allora lo rifaccio
            //e rimemorizzo il token
            var tokenStr = localStorage.getItem('currentToken');
            var token = JSON.parse(tokenStr);
            var actualTimeStamp = new Date().getTime();
            var elapsedTimeInMillis = actualTimeStamp - token.creationTimeStamp;
            var localStore = new securityLocalStore();
            if (!token || elapsedTimeInMillis > 20 * 60 * 1000) {
                //devo rifare il login
                //se non c� proprio il token redirigo alla pagina di login
               
                if (!token) {
                    
                    localStore.clearCredentials();
                    d.reject('Refresh token non riuscito. Token non trovato');
                } else {

                    //devo rifare il login per rinfrescare il token
                    localStore.getCredentials().done(function (cred) {

                        //una volta ottenute le credenziali
                        //posso eseguire nuovamente il login
                        var svc = new securityRemoteStore();
                        svc.login(cred.username, cred.password)
                            .done(function (data) {
                                //reimposto le nuove credenziali con il token aggiornato
                                localStore.setCredentials(data, cred.password)
                                params.token = token.token;
                                d.resolve(params);
                            }).fail(function (error) {
                                localStore.clearCredentials();
                                d.reject('Refresh token non riuscito. Login non riuscito');
                                
                            });

                    });

                }
                return d.promise();
            }


            //metto nei parametri il valore del token
            params.token = token.token;
            return d.resolve(params).promise();

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
    //questa classe � necessaria perch� devo memorizzare le credenziali dell'utente quando l'app si chiude
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
            
            //pe motivi STRANI di ritardo nel local storage inserisco il token anche nel namespace dell'aplicazione
            localStorage.setItem('currentToken', JSON.stringify(token));


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
            //verifico se gi� esiste
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
    //classe per la gesrione della sicurezza remota
    var securityRemoteStore = AbstractRemoteStore.extend({
        ctor: function () {
            securityRemoteStore.super.ctor.call(this);
        },
        checkConnection : function () {

            var params = {
                route: 'connection',

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


 
    //*********************************************
    //*********************************************
    //classe per la gesrione delle entita geografiche
    var geoRemoteStore = AbstractRemoteStore.extend({
        ctor: function () {
            geoRemoteStore.super.ctor.call(this);
        },
        getCountries: function () {

            var params = {
                route: 'values/allcountries',
                method:'GET'

            }

            return this.loadProtectedService(params);
        },
        getProvinces: function () {

            var params = {
                route: 'values/allprovinces',
                method:'GET'
            }
            return this.loadProtectedService(params);

        },
        getCities: function (provincia) {

            var params = {
                route: 'values/cities?keyword=' + encodeURIComponent(provincia),
                 method:'GET'
            }
            return this.loadProtectedService(params);

        }

    });

    //*********************************************
    //*********************************************
   



    Fenealweb.db = {};
    Fenealweb.db.securityLocalStore = securityLocalStore;
    Fenealweb.db.securityRemoteStore = securityRemoteStore;
    Fenealweb.db.geoRemoteStore = geoRemoteStore;
}());
