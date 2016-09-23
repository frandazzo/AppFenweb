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

            //var tokenStore = new securityLocalStore();
            //tokenStore.getToken().done(function (token) {
            //    params.token = token;
            //    d.resolve(params);
            //});

            //return d;
            
            //qui devo verificare la validità del token
            //se il login lo ho effettuato piu di venti minuti fa allora lo rifaccio
            //e rimemorizzo il token
            var tokenStr = localStorage.getItem('currentToken');
            var token = JSON.parse(tokenStr);
            var actualTimeStamp = new Date().getTime();
            var elapsedTimeInMillis = actualTimeStamp - token.creationTimeStamp;
            var localStore = new securityLocalStore();
            if (!token || elapsedTimeInMillis > 20 * 60 * 1000) {
                //devo rifare il login
                //se non cè proprio il token redirigo alla pagina di login
               
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
   
    //*********************************************
    //*********************************************
    //classe per la gesrione delle entita geografiche
    var dashboardStore = AbstractRemoteStore.extend({
        ctor: function () {
            dashboardStore.super.ctor.call(this);
        },
        getAndamentoIscrittiEnte: function(provincia){
            var queryString = '';

            if (provincia)
                queryString = '?province=' + encodeURIComponent(provincia);

            var params = {
                route: 'widget/real/andamentoIscrittiPerSettoreEdile/getAppData' + queryString,
                method: 'GET'

            }
            return this.loadProtectedService(params);
        },
        getIscrittiTerritorioAccorpato: function (anno) {

            var queryString = '?anno=' + anno;

            var params = {
                route: 'widget/real/contatoreIscrittiTerritorioAccorpato/getAppData' + queryString,
                method: 'GET'

            }
            return this.loadProtectedService(params);
        },
        getAndamentoIscrittiSettore: function (provincia) {
            var queryString = '';

            if (provincia)
                queryString = '?province=' + encodeURIComponent(provincia);

            var params = {
                route: 'widget/real/andamentoIscrittiPerProvincia/getAppData' + queryString,
                method: 'GET'

            }
            return this.loadProtectedService(params);
        },
        getAndamentoIscrittiTerritorioAccorpato: function(){
           

            var params = {
                route: 'widget/real/andamentoIscrittiPerTerritorioAccorpato/getData',
                method: 'GET'

            }
            return this.loadProtectedService(params);
        },
        getRappresentanza: function (provincia, ente) {



            var queryString = '';

            if (provincia)
                queryString = '?province=' + encodeURIComponent(provincia);

            if (ente) {
                if (provincia) {
                    queryString = queryString + '&ente=' + encodeURIComponent(ente);
                } else {
                    queryString = '?ente=' + encodeURIComponent(ente);
                }
            }

            var params = {
                route: 'widget/real/sindacalizzazione/getAppData' + queryString,
                method: 'GET'

            }

            return this.loadProtectedService(params);
        }
       

    });

    //*********************************************
    //*********************************************



    //*********************************************
    //*********************************************
    //classe per la gesrione dei lavoratori
    var lavoratoriStore = AbstractRemoteStore.extend({
        ctor: function () {
            lavoratoriStore.super.ctor.call(this);
        },
        getLavoratore: function (fiscale) {
           



            var params = {
                route: '/workerforapp/' + fiscale,
                method: 'GET'

            }

            return this.loadProtectedService(params);
        },
        getLavoratoreForNonIscritti: function (fiscale, provincia) {




            var params = {
                route: '/workernoniscrittoforapp/' + fiscale + '?province=' + encodeURIComponent(provincia),
                method: 'GET'

            }

            return this.loadProtectedService(params);
        },
        calculateFiscalCode: function (nome, cognome, comuneNascita, dataNascita, nazione, sesso ) {


            var lav = {
                 name : nome, 
                 surname: cognome,
                 dateBirth: dataNascita,
                 birthPlaceName: comuneNascita,
                 sex: sesso,
                 birthNationName: nazione
            };

            var params = {
                route: '/worker/fiscalcodeforapp',
                method: 'GET',
                data: lav
            }

            return this.loadProtectedService(params);
        },
        getLavoratori: function (cognome, nome, fiscale) {
            var queryString = '';
            if (fiscale) {   
                queryString = '?fiscalcode=' + encodeURIComponent(fiscale);
            } else {
                if (cognome)
                    queryString = '?surname=' + encodeURIComponent(cognome);

                if (nome) {
                    if (cognome) {
                        queryString = queryString + '&name=' + encodeURIComponent(nome);
                    } else {
                        queryString = '?name=' + encodeURIComponent(nome);
                    }
                }
            }

            var params = {
                route: 'localworkersforapp' + queryString,
                method: 'GET'

            }

            return this.loadProtectedService(params);
        },
        getLavoratoriDbNazionale: function (cognome, nome, fiscale, provinciaResidenza, comuneResidanze, nazione) {
            var queryString = '';
            


            if (cognome)
                queryString = '?surname=' + encodeURIComponent(cognome);

            if (nome) {
                if (queryString) {
                    queryString = queryString + '&name=' + encodeURIComponent(nome);
                } else {
                    queryString = '?name=' + encodeURIComponent(nome);
                }
            }

            if (fiscale) {
                if (queryString) {
                    queryString = queryString + '&fiscalcode=' + encodeURIComponent(fiscale);
                } else {
                    queryString = '?fiscalcode=' + encodeURIComponent(fiscale);
                }
            }

            if (provinciaResidenza) {
                if (queryString) {
                    queryString = queryString + '&livingProvince=' + encodeURIComponent(provinciaResidenza);
                } else {
                    queryString = '?livingProvince=' + encodeURIComponent(provinciaResidenza);
                }
            }

            if (comuneResidanze) {
                if (queryString) {
                    queryString = queryString + '&livingCity=' + encodeURIComponent(comuneResidanze);
                } else {
                    queryString = '?livingCity=' + encodeURIComponent(comuneResidanze);
                }
            }

            if (nazione) {
                if (queryString) {
                    queryString = queryString + '&nationality=' + encodeURIComponent(nazione);
                } else {
                    queryString = '?nationality=' + encodeURIComponent(nazione);
                }
            }
          

            var params = {
                route: 'remoteworkersforapp' + queryString,
                method: 'GET'

            }

            return this.loadProtectedService(params);
        },
        saveLavoratore: function (lavoratore) {

            //devo creare una ui anagraficaAzienda
            var lav = {
                id: lavoratore.id,
                name: lavoratore.nome,
                surname: lavoratore.cognome,
                sex: lavoratore.sesso,
                fiscalcode: lavoratore.fiscale,
                birthDate: lavoratore.dataNascita,
                //birthDateTime: lavoratore.lavoratore.dataNascita.getTime(),
                nationality: lavoratore.nazione,
                birthProvince: lavoratore.provinciaNascita,
                birthPlace: lavoratore.comuneNascita,
                livingProvince: lavoratore.provinciaResidenza,
                livingCity: lavoratore.comuneResidenza,
                address: lavoratore.indirizzo,
                cap: lavoratore.cap,
                phone: lavoratore.telefono,
                cellphone: lavoratore.cellulare,
                mail: lavoratore.mail,
              

            };
        
            //private String nationality;
            //private String birthProvince;
            //private String birthPlace;
            //private String livingProvince;
            //private String livingCity;

            //private String address;
            //private String cap;
            //private String phone;
            //private String cellphone;
            //private String mail;

            var params = {
                route: '/worker',
                isJsonContentType: true,
                data: lav,
                method: 'POST'

            }

            return this.loadProtectedService(params);
        },

    });

    //*********************************************
    //*********************************************


    //*********************************************
    //*********************************************
    //classe per la gesrione delle aziende
    var aziendeStore = AbstractRemoteStore.extend({
        ctor: function () {
            aziendeStore.super.ctor.call(this);
        },
        saveAzienda: function (azienda) {

            //devo creare una ui anagraficaAzienda
            var az = {
                id: azienda.id,
                description: azienda.descrizione,
                province: azienda.provincia,
                city: azienda.comune,
                address: azienda.indirizzo,
                cap: azienda.cap

            };


            var params = {
                route: '/firm',
                isJsonContentType: true,
                data: az,
                method: 'POST'

            }

            return this.loadProtectedService(params);
        },
        getAzienda: function (ragioneSociale) {

          
            var params = {
                route: '/firmforapp?description=' + encodeURIComponent(ragioneSociale),
                method: 'GET'

            }

            return this.loadProtectedService(params);
        },
        getAziendaById: function(id){
            var params = {
                route: '/firmforappbyid?id=' + encodeURIComponent(id),
                method: 'GET'

            }

            return this.loadProtectedService(params);
        },
        getAziende: function (ragioneSociale) {

            if (!ragioneSociale) {
                ragioneSociale = '';
            }

            var queryString = '?description=' + encodeURIComponent(ragioneSociale);
            

            var params = {
                route: '/remotefirmsearchforapp' + queryString,
                method: 'GET'

            }

            return this.loadProtectedService(params);
        }
      

    });

    //*********************************************
    //*********************************************


    //*********************************************
    //*********************************************
    //classe per la gesrione delle deleghe
    var delegheStore = AbstractRemoteStore.extend({
        ctor: function () {
            delegheStore.super.ctor.call(this);
        },
        getCollaboratori: function () {


            var params = {
                route: '/values/collaborators',
                method: 'GET'

            }

            return this.loadProtectedService(params);
        },
        getCausaliDelega: function () {


            var params = {
                route: '/values/causalideleghe',
                method: 'GET'
            }

            return this.loadProtectedService(params);
        },
        saveDelega: function (delega) {

           

            var params = {
                route: '/delegaforapp',
                isJsonContentType: true,
                data: delega,
                method: 'POST'

            }

            return this.loadProtectedService(params);

        },
        deleteDelega: function (id) {



            var params = {
                route: '/delega/' + id,
                method: 'DELETE'

            }

            return this.loadProtectedService(params);

        },
        saveMagazzinoDelega: function (delega) {



            var params = {
                route: '/magdelegaforapp',
                isJsonContentType: true,
                data: delega,
                method: 'POST'

            }

            return this.loadProtectedService(params);

        },
        deleteMagazzinoDelega: function (id) {



            var params = {
                route: '/magdelegaforapp/' + id,
                method: 'DELETE'

            }

            return this.loadProtectedService(params);

        }
       

    });

    //*********************************************
    //*********************************************

    //*********************************************
    //*********************************************
    //classe per la gesrione delle deleghe
    var reportStore = AbstractRemoteStore.extend({
        ctor: function () {
            reportStore.super.ctor.call(this);
        },
        reportIscritti: function (searchParams) {


            var params = {
                route: '/iscritti/reportforapp',
                isJsonContentType: true,
                data: searchParams,
                method: 'POST'

            }

            return this.loadProtectedService(params);
        },
        reportNonIscritti: function (searchParams) {


            var params = {
                route: '/liberi/reportforapp',
                isJsonContentType: true,
                data: searchParams,
                method: 'POST'
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
    Fenealweb.db.lavoratoriStore = lavoratoriStore;
    Fenealweb.db.dashboardStore = dashboardStore
    Fenealweb.db.aziendeStore = aziendeStore;
    Fenealweb.db.delegheStore = delegheStore;
    Fenealweb.db.reportStore = reportStore;
}());
