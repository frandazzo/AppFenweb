(function () {
    
   
    var securityService = Fenealweb.core.AObject.extend({
        ctor: function(){
            securityService.super.ctor.call(this);
        },
        clearLocalStore : function () {
            var db = new Fenealweb.db.securityLocalStore();
            db.clearCredentials();
        },
        login : function (username, password) {
            //alert('login of ' + username + ' with password ' + password);
            

            

            var db = new Fenealweb.db.securityLocalStore();
            var secStore = new Fenealweb.db.securityRemoteStore();

            return secStore.login(username, password).done(function (data) {

                //se il login è andato a buon fine posso salvare le credenziali
                var promise = db.setCredentials(data, password);
                promise.done(function () {
                    console.log("Nuove credenziali salvate: " + data);
                });
            })
            .fail(function (error) {

                db.clearCredentials();


            });

        }
       
    });
   

    var commonsService = Fenealweb.core.AObject.extend({
        ctor: function () {
            commonsService.super.ctor.call(this);
        },
        getListaEntiBilaterali: function () {
            var lista = ["CALEC",
                 "CASSA EDILE",
                 "CEA",
                 "CEC",
                 "CEDA",
                 "CEDAF",
                 "CEDAIIER",
                 "CEDAM",
                 "CELCOF",
                 "CEMA",
                 "CERT",
                 "CEVA",
                 "FALEA",
                 "EDILCASSA"

            ];

            return $.Deferred().resolve(lista).promise();
        },
        getListaAnniRiferimento: function () {
            var lista = new Array();
            var j = 1989;
            for (var i = 1; i < 40; i++) {
                lista.push(j + i);
                
            }
            return $.Deferred().resolve(lista).promise();
        },
        getListaProvince: function () {

            var d = $.Deferred();
            var db = new Fenealweb.db.securityLocalStore();
            db.getCredentials().done(function (data) {


                d.resolve(data.provinces);
            });
            return d.promise();
        }

    });



    var dashboardService = Fenealweb.core.AObject.extend({
        ctor: function () {
            dashboardService.super.ctor.call(this);
        },
        getListeInputDashboard: function () {
            var d = $.Deferred();

            var commonsService = new commonsService();
            var p1 = commonsService.getListaEntiBilaterali();
            var p2 = commonsService.getListaAnniRiferimento();
            var p3 = commonsService.getListaProvince();
            
            $.when(d1, d2, d3).done(function () {

                var data = {
                    enti: d1,
                    anni: d2,
                    province: d3
                };
                d.resolve(data);
            });

            return $.Deferred().promise();
        },
        getRappresentanza: function (anno, ente) {
            var d = $.Deferred();

            if (!anno)
                anno = new Date().getFullYear();

            if (!ente)
                ente = "CASSA EDILE";

            setTimeout(function () {
                d.resolve({ anno: anno, ente: ente });
            }, 2000);

            return d.promise();
        },
        getAndamentoIscrittiTerritorioAccorpato : function(){
            var d = $.Deferred();

            setTimeout(function () {
                d.resolve();
            }, 6000);

            return d.promise();
        },

        getAndamentoIscrittiEnte: function (provincia) {
            var d = $.Deferred();

            setTimeout(function () {
                d.resolve();
            }, 4500);

            return d.promise();
        },
        getAndamentoIscrittiSettore: function (provincia) {
            var d = $.Deferred();

            setTimeout(function () {
                d.resolve();
            }, 5000);

            return d.promise();
        },

        getIscrittiTeritorioAccorpato: function (anno) {
            var d = $.Deferred();

            if (!anno) 
                anno = new Date().getFullYear();

            setTimeout(function () {
                d.resolve({ anno: anno });
            }, 3000);

            return d.promise();
        }

    });

    var lavoratoriService = Fenealweb.core.AObject.extend({
        ctor: function () {
            lavoratoriService.super.ctor.call(this);
        },
        searchLavoratori: function (searchParams) {

            var cognome = searchParams.cognome;
            var nome = searchParams.nome;
            var fiscale = searchParams.fiscale;

            var d = $.Deferred();

            setTimeout(function () {

                if (cognome == '0')
                    d.resolve([]);
                else
                    d.resolve(listaLavoratori);

            }, 2000);

            return d.promise();
        },
        searchLavoratoriDbNazionale: function (searchParams) {

            var cognome = searchParams.cognome;
            var nome = searchParams.nome;
            var fiscale = searchParams.fiscale;
            var sesso = searchParams.sesso;
            var proRes = searchParams.ProvinciaResidenza;
            var comRes = searchParams.comuneResidenza;
            var naz = searchParams.nazione;

            var d = $.Deferred();

            setTimeout(function () {

                if (cognome == '0')
                    d.resolve([]);
                else
                    d.resolve(listaLavoratoriDbNazionale);

            }, 2000);

            return d.promise();
        },
        getLavoratoreByFiscalCode: function (fiscalCode) {
            var d = $.Deferred();

            setTimeout(function () {

                var lavoratore = undefined;
                $.each(listaLavoratoriDbNazionale, function (index, elem) {
                    if (fiscalCode.toUpperCase() == elem.fiscale.toUpperCase()) {
                        lavoratore = elem;
                        return false;
                    }
                        


                });
               
               d.resolve(lavoratore);

            }, 2000);

            return d.promise();
        }

    });


    Fenealweb.services = {};
    Fenealweb.services.securityService = securityService;
    Fenealweb.services.commonsService = commonsService;
    Fenealweb.services.dashboardService = dashboardService;
    Fenealweb.services.lavoratoriService = lavoratoriService;


    var listaLavoratori = [
        {
            id: 1,
            nome: 'francesco',
            cognome: 'randazzo',
            dataNascita: '14/07/1977',
            fiscale: 'rndfnc77l14f052f',
            sesso: 'M',
            provinciaResidenza: 'MT',
            comuneResidenza: 'MATERA',
            nazione: 'ITALIA',
            provinciaNascita: 'MT',
            comuneNascita: 'MATERA',
            indirizzo: 'c.da serra d\'alto snc',
            cap: '75100',
            cellulare: '3385269726',
            mail: 'fg.randazzo@hotmail.it',
            telefono: ''
        },
        {
            id: 2,
            nome: 'silvana',
            cognome: 'colomba',
            dataNascita: '03/11/1974',
            fiscale: 'clmsvn74n43f423k',
            sesso: 'F',
            provinciaResidenza: 'MT',
            comuneResidenza: 'MATERA',
            nazione: 'ITALIA',
            provinciaNascita: 'TP',
            comuneNascita: 'BUSETO PALIZZOLO',
            indirizzo: 'c.da serra d\'alto snc',
            cap: '75100',
            cellulare: '3385226362',
            mail: 'silvana.colomba@tiscali.it',
            telefono: ''
        },
        {
            id: 3,
            nome: 'vittorio',
            cognome: 'randazzo',
            dataNascita: '16/02/2015',
            fiscale: 'rndvtt15f16f052f',
            sesso: 'M',
            provinciaResidenza: 'MT',
            comuneResidenza: 'MATERA',
            nazione: 'ITALIA',
            provinciaNascita: 'PZ',
            comuneNascita: 'POTENZA',
            indirizzo: 'c.da serra d\'alto snc',
            cap: '75100',
            cellulare: '',
            mail: '',
            telefono: ''
        },
        {
            id: 4,
            nome: 'mariaelena',
            cognome: 'randazzo',
            dataNascita: '16/02/2015',
            fiscale: 'rndvtt15f56f052f',
            sesso: 'F',
            provinciaResidenza: 'MT',
            comuneResidenza: 'MATERA',
            nazione: 'ITALIA',
            provinciaNascita: 'PZ',
            comuneNascita: 'POTENZA',
            indirizzo: 'c.da serra d\'alto snc',
            cap: '75100',
            cellulare: '',
            mail: '',
            telefono: ''
        }
    ];


    var listaLavoratoriDbNazionale = [
        {
            id:1,
            nome: 'francesco',
            cognome: 'randazzo',
            dataNascita: '14/07/1977',
            fiscale: 'rndfnc77l14f052f',
            sesso: 'M',
            provinciaResidenza: 'MT',
            comuneResidenza: 'MATERA',
            nazione: 'ITALIA',
            provinciaNascita: 'MT',
            comuneNascita: 'MATERA',
            indirizzo: 'c.da serra d\'alto snc',
            cap: '75100',
            cellulare: '3385269726',
            mail: 'fg.randazzo@hotmail.it',
            telefono: '',
            deleghe: [
                {
                    provincia: 'Bolzano',
                    settore: 'EDILE',
                    ente: 'CASSA EDILE',
                    azienda:'',
                    data: '31/12/2016',
                    causale: 'NUOVA ISCRIZIONE',
                    causaleAnnullamento: '',
                    causaleRevoca: '',
                    stato: 'SOTTOSCRITTA',
                    collaboratore: 'Spinelli Patrizia'

                },
                {
                    provincia: 'Bolzano',
                    settore: 'IMPIANTI FISSI',
                    ente: '',
                    azienda: 'NATUZZI',
                    data: '31/12/2016',
                    causale: 'CON REVOCA FILCA',
                    causaleAnnullamento: '',
                    causaleRevoca: '',
                    stato: 'ATTIVATA',
                    collaboratore: ''
                }
            ],
            magazzino: [
                {
                    provincia: 'Bolzano',
                    ente: 'CASSA EDILE',
                    data: '31/12/2016',
                    collaboratore: 'Spinelli Patrizia'
                   
                },
                {
                    provincia: 'Bolzano',
                    ente: 'EDILCASSA',
                    data: '31/12/2016',
                    collaboratore: 'Spinelli Patrizia'
                }
            ],
            nonIscrizioni:[
                {
                    provincia: 'Bolzano',
                    ente: 'CASSA EDILE',
                    liberoAl: '31/12/2016',
                    azienda: 'Alla Spa',
                    iscrittoA: 'FILLEA'
                },
                {
                    provincia: 'Trento',
                    ente: 'CASSA EDILE',
                    liberoAl: '15/07/2016',
                    azienda: '',
                    iscrittoA: ''
                }
            ],
            iscrizioni: [
                {
                    provincia: 'MATERA',
                    settore: 'EDILE',
                    ente: 'CASSA EDILE',
                    periodo: 1,
                    anno: 2014,
                    azienda: 'SAS srl',
                    piva: '',
                    livello: '',
                    quota: '0.01',
                    contratto: ''
                },
                {
                    provincia: 'POTENZA',
                    settore: 'INPS',
                    ente: '',
                    periodo: -1,
                    anno: 2016,
                    azienda: '',
                    piva: '',
                    livello: '',
                    quota: '',
                    contratto: ''
                }
            ]
        },
        {
            id: 2,
            nome: 'silvana',
            cognome: 'colomba',
            dataNascita: '03/11/1974',
            fiscale: 'clmsvn74n43f423k',
            sesso: 'F',
            provinciaResidenza: 'MT',
            comuneResidenza: 'MATERA',
            nazione: 'ITALIA',
            provinciaNascita: 'TP',
            comuneNascita: 'BUSETO PALIZZOLO',
            indirizzo: 'c.da serra d\'alto snc',
            cap: '75100',
            cellulare: '3385226362',
            mail: 'silvana.colomba@tiscali.it',
            telefono: '',
            iscrizioni: [
                {
                    provincia: 'MATERA',
                    settore: 'IMPIANTI FISSI',
                    ente: '',
                    periodo: 1,
                    anno: 2014,
                    azienda: 'Progetto popolare',
                    piva: '',
                    livello: '',
                    quota: '',
                    contratto: ''
                }
            ]
        },
        {
            id: 3,
            nome: 'vittorio',
            cognome: 'randazzo',
            dataNascita: '16/02/2015',
            fiscale: 'rndvtt15f16f052f',
            sesso: 'M',
            provinciaResidenza: 'MT',
            comuneResidenza: 'MATERA',
            nazione: 'ITALIA',
            provinciaNascita: 'PZ',
            comuneNascita: 'POTENZA',
            indirizzo: 'c.da serra d\'alto snc',
            cap: '75100',
            cellulare: '',
            mail: '',
            telefono: '',
            iscrizioni: [
                {
                    provincia: 'MATERA',
                    settore: 'IMPIANTI FISSI',
                    ente: '',
                    periodo: 1,
                    anno: 2016,
                    azienda: 'Progetto popolare',
                    piva: '',
                    livello: '',
                    quota: '',
                    contratto: ''
                }
            ]
        },
        {
            id: 4,
            nome: 'mariaelena',
            cognome: 'randazzo',
            dataNascita: '16/02/2015',
            fiscale: 'rndvtt15f56f052f',
            sesso: 'F',
            provinciaResidenza: 'MT',
            comuneResidenza: 'MATERA',
            nazione: 'ITALIA',
            provinciaNascita: 'PZ',
            comuneNascita: 'POTENZA',
            indirizzo: 'c.da serra d\'alto snc',
            cap: '75100',
            cellulare: '',
            mail: '',
            telefono: '',
            iscrizioni: []
        }
    ];


}());

//var precedingDataPromise = db.getCredentials();
//precedingDataPromise.done(function (data) {

//    //se esistono mostro le precedenti
//    if (data) {
//        alert('esitono altre credenziali: username: ' + data.username + ' e password ' + data.password);
//    } else {
//        alert('non esistono altre credenziali');
//    }

//    //salvo le nuove creenziali
//    var promise = db.setCredentials(username, password);

//    //recupro le ultime credenziali per vedere se esistono
//    promise.done(function () {
//        //a questo punto posso notificare tutto
//        alert('nuove credenziali salvate');
//    });
//});
