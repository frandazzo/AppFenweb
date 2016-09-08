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
        getSettori: function () {
            var lista = [
                 "EDILE",
                 "IMPIANTI FISSI",
                 "INPS"

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
        getListaIscrittoA:function(){
            var lista = ["",
                 "FILCA",
                 "FILLEA"
            ];

            return $.Deferred().resolve(lista).promise();
        },
        getListaProvince: function () {

            var d = $.Deferred();
            var db = new Fenealweb.db.securityLocalStore();
            db.getCredentials().done(function (data) {


                d.resolve(data.provinces);
            });
            return d.promise();
        },

        getGeoNazioni:function(){
            var svc = new Fenealweb.db.geoRemoteStore();
            return svc.getCountries();
        },
        getGeoProvinces: function () {
            var svc = new Fenealweb.db.geoRemoteStore();
            return svc.getProvinces();
        },
        getGeoComuni: function (provincia) {
            var svc = new Fenealweb.db.geoRemoteStore();
            return svc.getCities(provincia);
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
        getRappresentanza: function (provincia, ente) {


            var svc = new Fenealweb.db.dashboardStore();
            return svc.getRappresentanza(provincia, ente);
           

            //var d = $.Deferred();

           
            //var data = [
            //    {
            //        sindacato: "Feneal",
            //        iscritti: 1110
            //    }, {
            //        sindacato: "Filca",
            //        iscritti: 1150
            //    }, {
            //        sindacato: "Fillea",
            //        iscritti: 1290
            //    }
            //];

            //if (!ente)
            //    ente = "CASSA EDILE";


            //if (ente != 'CASSA EDILE')
            //    data = [];

            //setTimeout(function () {
            //    d.resolve({ provincia: provincia, ente: ente, data: data });
            //}, 2000);

            //return d.promise();
        },
        getAndamentoIscrittiTerritorioAccorpato: function () {

            var self = this;
            var d = $.Deferred();

            var svc = new Fenealweb.db.dashboardStore();
            svc.getAndamentoIscrittiTerritorioAccorpato()
                .done(function (data) {
                    var transformedData = self.__normalizeData(data);
                    d.resolve({
                        data: transformedData.data,
                        series: transformedData.series
                    });
                });


            return d.promise();
            //var d = $.Deferred();

            //var serverdata = {
            //    anni: [
            //        2014,
            //        2015,
            //        2016
            //    ],
            //    values: [
            //        {
            //            name: 'Caserta',
            //            data: [
            //                1000,
            //                1210,
            //                900
            //            ]
            //        },
            //        {
            //            name: 'Avellino',
            //            data: [
            //                100,
            //                121,
            //                90
            //            ]
            //        },
            //        {
            //            name: 'Benevento',
            //            data: [
            //                199,
            //                1216,
            //                700
            //            ]
            //        }
            //    ]
            //};

            //var transformedData = this.__normalizeData(serverdata);

            //setTimeout(function () {
            //    d.resolve({

            //        data: transformedData.data,
            //        series: transformedData.series


            //    });
            //}, 4500);

            //return d.promise();
        },

        __normalizeData: function(serverData){

            var result = {
                data: [],
                series: []
            };


            //recupero la lista dei dati in piu' step
            //step 1: creo una lista di oggetti con l'anno
            $.each(serverData.anni, function (index, elem) {
                result.data.push({
                    anno: elem.toString()
                });
            });
            //step 2: ciclo l'array dei values per calcolare (la proprietà name di ogni value puo avere spazi, essere cmel case ecc ad esempio Cassa Edile deve diventare cassaedile)
            //il nome della proprietà. Posso inoltre costruire la lista delle serie
            $.each(serverData.values, function (index, elem) {

                //da ogni value recupero la proprietà name
                var name = elem.name;
                //il nome sarà anche la descrizione della serie
                var normalizedName = name.toLowerCase().replace(' ', '');

                //creo l'oggetto serie e lo inserisco  nella lista
                var serie =  {
                    valueField: normalizedName,
                    name: name
                }
                result.series.push(serie);

                //adesso posso creare per ogni elemento nell'array dei dati unaproprieta di nome normalizedname
                //e assegnargli il relativo valore nell'array values.data
                for (var i = 0; i < result.data.length; i++) {
                    var seriesData = result.data[i];
                    //ne creo la proprietà
                    seriesData[normalizedName] = elem.data[i];
                }


            });

            return result;
        },
        getAndamentoIscrittiEnte: function (provincia) {
            var self = this;
            var d = $.Deferred();

            var svc = new Fenealweb.db.dashboardStore();
            svc.getAndamentoIscrittiEnte(provincia)
                .done(function (data) {
                    var transformedData = self.__normalizeData(data);
                        d.resolve({

                            provincia: data.provincia,
                            data: transformedData.data,
                            series: transformedData.series


                        });
                });

           
            return d.promise();
            ////definisci i dati cosi come mi arriiveranno
            //var serverdata = {
            //    anni: [
            //        2014,
            //        2015,
            //        2016
            //    ],
            //    values: [
            //        {
            //            name: 'Cassa edile',
            //            data: [
            //                1000,
            //                1210,
            //                900
            //            ]
            //        },
            //        {
            //            name: 'Edilcassa',
            //            data: [
            //                100,
            //                121,
            //                90
            //            ]
            //        }
            //    ]
            //};

            //if (!provincia) {
            //    serverdata = {
            //        anni: [
            //            2014,
            //            2015,
            //            2016
            //        ],
            //        values: [
            //            {
            //                name: 'Cassa edile',
            //                data: [
            //                    1000,
            //                    1210,
            //                    900
            //                ]
            //            }
            //        ]
            //    };
            //}

        },
        getAndamentoIscrittiSettore: function (provincia) {
            var self = this;
            var d = $.Deferred();

            var svc = new Fenealweb.db.dashboardStore();
            svc.getAndamentoIscrittiSettore(provincia)
                .done(function (data) {
                    var transformedData = self.__normalizeData(data);
                    d.resolve({

                        provincia: data.provincia,
                        data: transformedData.data,
                        series: transformedData.series


                    });
                });


            return d.promise();
            //var d = $.Deferred();

            //var data = [
            //   {
            //       anno: "2009",
            //       edile: 1110,
            //       impiantiFissi: 200,
                  
            //   }, {
            //       anno: "2012",
            //       edile: 1700,
            //       impiantiFissi: 100,
            //       inps: 154
            //   }, {
            //       anno: "2014",
            //       edile: 800,
            //       impiantiFissi: 0,
            //       inps: 10
            //   },
            //    {
            //        anno: "2015",
            //        edile: 1310,
            //        impiantiFissi: 100,
            //        inps: 22
            //    },
            //     {
            //         anno: "2016",
            //         edile: 990,
            //         impiantiFissi: 300,
            //         inps: 0
            //     }
            //];



            //setTimeout(function () {
            //    d.resolve({

            //        provincia: provincia,
            //        data:data

            //    });
            //}, 1000);

            //return d.promise();
        },

        getIscrittiTeritorioAccorpato: function (anno) {

            if (!anno)
                anno = new Date().getFullYear();

            var self = this;
            var d = $.Deferred();

            var svc = new Fenealweb.db.dashboardStore();
            svc.getIscrittiTerritorioAccorpato(anno)
                .done(function (data) {
                    var transformedData = self.__normalizeData(data);
                    d.resolve({
                        data: data,
                        anno: anno
                    });
                });


            return d.promise();

            //var d = $.Deferred();

            //if (!anno) 
            //    anno = new Date().getFullYear();

            //var data = [
            //    {
            //        territorio: "Trento",
            //        numIiscritti: 1110
            //    }, {
            //        territorio: "Bolzano",
            //        numIiscritti: 1150
            //    }, {
            //        territorio: "Padova",
            //        numIiscritti: 1290
            //    }
            //];

            //setTimeout(function () {
            //    d.resolve({ anno: anno, data: data });
            //}, 3000);

            //return d.promise();
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


            var svc = new Fenealweb.db.lavoratoriStore();
            return svc.getLavoratori(cognome, nome, fiscale);
            




            //var d = $.Deferred();

            //setTimeout(function () {

            //    if (cognome == '0')
            //        d.resolve([]);
            //    else
            //        d.resolve(listaLavoratori);

            //}, 2000);

            //return d.promise();
        },
        searchLavoratoriDbNazionale: function (searchParams) {

            var cognome = searchParams.cognome;
            var nome = searchParams.nome;
            var fiscale = searchParams.fiscale;
            var proRes = searchParams.provinciaResidenza;
            var comRes = searchParams.comuneResidenza;
            var naz = searchParams.nazione;

            var svc = new Fenealweb.db.lavoratoriStore();
            return svc.getLavoratoriDbNazionale(cognome, nome, fiscale, proRes, comRes, naz);

            //var d = $.Deferred();

            //setTimeout(function () {

            //    if (cognome == '0')
            //        d.resolve([]);
            //    else
            //        d.resolve(listaLavoratoriDbNazionale);

            //}, 2000);

            //return d.promise();
        },
        getLavoratoreByFiscalCode: function (fiscalCode) {


            var svc = new Fenealweb.db.lavoratoriStore();
            return svc.getLavoratore(fiscalCode);

            //var d = $.Deferred();

            //setTimeout(function () {

            //    var lavoratore = undefined;
            //    $.each(listaLavoratoriDbNazionale, function (index, elem) {
            //        if (fiscalCode.toUpperCase() == elem.fiscale.toUpperCase()) {
            //            lavoratore = elem;
            //            return false;
            //        }
                        


            //    });
               
            //   d.resolve(lavoratore);

            //}, 2000);

            //return d.promise();
        }

    });

    var aziendeService = Fenealweb.core.AObject.extend({
        ctor: function () {
            aziendeService.super.ctor.call(this);
        },
        searchAziende: function (descrizione) {

            
            
            var d = $.Deferred();

            setTimeout(function () {

                if (!descrizione)
                    d.resolve(listaAziende);
                else
                    d.resolve(listaAziende.slice(0,1));

            }, 2000);

            return d.promise();
        },
        getAziendaById: function (id) {

           

            var d = $.Deferred();

            setTimeout(function () {

               
                    d.resolve(listaAziende[0]);

            }, 2000);

            return d.promise();
        }

    });

    Fenealweb.services = {};
    Fenealweb.services.securityService = securityService;
    Fenealweb.services.commonsService = commonsService;
    Fenealweb.services.dashboardService = dashboardService;
    Fenealweb.services.lavoratoriService = lavoratoriService;
    Fenealweb.services.aziendeService = aziendeService;

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

    var listaAziende = [
        {
            id: 1,
            descrizione: 'Natuzzi',
            provincia: 'MT',
            comune: 'Matera',
            indirizzo: 'via delle chianche 18',
            cap: '75100',
            iscritti: [
                {
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

                }],
            nonIscritti: [
               {
                   nome: 'Francesco Randazzo DellaVedova di Magliano Sabina',
                   fiscale: 'rndfnc77l14f052f',
                   provincia: 'Bolzano',
                   ente: 'CASSA EDILE',
                   liberoAl: '31/12/2016',
                   azienda: 'Alla Spa',
                   iscrittoA: 'FILLEA',
                   badge: '3',
                   delegheOwner: true

                   
               },
               {
                   nome: 'Francesco Randazzo1',
                   fiscale: 'rndfnc77l14f052f11',
                   provincia: 'Trento',
                   ente: 'CASSA EDILE',
                   liberoAl: '15/07/2016',
                   azienda: '',
                   iscrittoA: '',
                   delegheOwner: false
                   
               }
            ]
        },
        {
            id: 2,
            descrizione: 'Euroedil',
            provincia: 'MT',
            comune: 'Matera',
            indirizzo: 'via dell\'acqua',
            cap: '75100'
        },
        {
            id: 3,
            descrizione: 'Nicoletti',
            provincia: 'MT',
            comune: 'Matera',
            indirizzo: 'zona paip 2',
            cap: '75100'
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
            badge:'6',
            stampeTessera:[
                'TRENTO',
                'BARI'
            ],
            quote: [
                {
                    provincia: 'Bolzano',
                    settore: 'EDILE',
                    ente: 'CASSA EDILE',
                    azienda: 'zzzz',
                    data: '31/12/2016',
                    dataRegistrazione: '31/12/2016',
                    tipo: 'IQA',
                    competenza:'1-2016',
                    livello: 'NUOVA ISCRIZIONE',
                    quota: '0,01',
                    contratto: '',
                    showChevron : true

                }],
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
                    collaboratore: 'Spinelli Patrizia',
                    note: '',
                    showChevron: true
                    

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
                    collaboratore: '',
                    note: '',
                    showChevron: true
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
                    contratto: '',
                    showChevron: true
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
                    contratto: '',
                    showChevron: true
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
            stampeTessera: [
               
            ],
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
            stampeTessera: [
                
            ],
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
            stampeTessera: [
                
                'BARI'
            ],
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
