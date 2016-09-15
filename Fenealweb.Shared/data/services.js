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
        getSettoriBase: function () {
            var lista = [
                 "EDILE",
                 "IMPIANTI FISSI"

            ];

            return $.Deferred().resolve(lista).promise();
        },
        getTipoQuote: function () {
            var lista = [
                 "Quote associative",
                 "Quote inps",
                 "Quote previsionali"

            ];

            return $.Deferred().resolve(lista).promise();
        },
        getMesi: function () {
            var lista = [
                 "Gennaio",
                 "Febbraio",
                 "Marzo",
                 "Aprile",
                  "Maggio",
                 "Giugno",
                  "Luglio",
                 "Agosto",
                  "Settembre",
                 "Ottobre",
                  "Novembre",
                 "Dicembre",

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
        },
        getListaCollaboratori: function () {
            var svc = new Fenealweb.db.delegheStore();
            return svc.getCollaboratori();
        },
        getListaCausaliDelega: function () {
            var svc = new Fenealweb.db.delegheStore();
            return svc.getCausaliDelega();
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
        },
        calculateFiscalCode: function (nome, cognome, comuneNascita, dataNascita, nazione, sesso) {


            function normalizeDataNascita(dataNas) {
               
                var year = dataNas.getFullYear();
                var day = dataNas.getDate();
                var month = dataNas.getMonth() + 1; //da 0 a 11 deve essere corretto con il +1

                //adesso devo mettere in piedi una stringa del tipo dd/MM/yyyy
                var dayString = day < 10 ? '0' + day.toString() : day.toString();
                var monthString = month < 10 ? '0' + month.toString() : month.toString();

                return dayString + "/" + monthString + "/" + year.toString();
            }

            var svc = new Fenealweb.db.lavoratoriStore();
            return svc.calculateFiscalCode(nome, cognome, comuneNascita, normalizeDataNascita(dataNascita), nazione, sesso);

        },
        saveLavoratore: function (lavoratore) {

            var svc = new Fenealweb.db.lavoratoriStore();
            return svc.saveLavoratore(lavoratore);

            //var d = $.Deferred();

            //setTimeout(function () {

            //   d.resolve("ok");

            //}, 2000);

            //return d.promise();
        },
        saveDelega: function (delega) {
            var svc = new Fenealweb.db.delegheStore();
            return svc.saveDelega(delega);
        },
        saveMagazzinoDelega: function (delega) {
            var svc = new Fenealweb.db.delegheStore();
            return svc.saveMagazzinoDelega(delega);
        },
        deleteDelega: function (id) {
            var svc = new Fenealweb.db.delegheStore();
            return svc.deleteDelega(id);
        },
        deleteMagazzinoDelega: function (id) {
            var svc = new Fenealweb.db.delegheStore();
            return svc.deleteMagazzinoDelega(id);
        }

    });
    var aziendeService = Fenealweb.core.AObject.extend({
        ctor: function () {
            aziendeService.super.ctor.call(this);
        },
        saveAzienda: function (azienda) {

            var svc = new Fenealweb.db.aziendeStore();
            return svc.saveAzienda(azienda);
        },
        searchAziende: function (descrizione) {

            var svc = new Fenealweb.db.aziendeStore();
            return svc.getAziende(descrizione);
            
            
            //var d = $.Deferred();

            //setTimeout(function () {

            //    if (!descrizione)
            //        d.resolve(listaAziende);
            //    else
            //        d.resolve(listaAziende.slice(0,1));

            //}, 2000);

            //return d.promise();
        },
        getAziendaById: function (descrizione) {

            var svc = new Fenealweb.db.aziendeStore();
            return svc.getAzienda(descrizione);
           

            //var d = $.Deferred();

            //setTimeout(function () {

               
            //        d.resolve(listaAziende[0]);

            //}, 2000);

            //return d.promise();
        },
        getAziendaByRealId: function (id) {

            var svc = new Fenealweb.db.aziendeStore();
            return svc.getAziendaById(id);


            //var d = $.Deferred();

            //setTimeout(function () {


            //        d.resolve(listaAziende[0]);

            //}, 2000);

            //return d.promise();
        }

    });
    var reportService = Fenealweb.core.AObject.extend({
        ctor: function () {
            reportService.super.ctor.call(this);
        },
        reportIscritti: function (params) {

            var svc = new Fenealweb.db.reportStore();
            return svc.reportIscritti(params);
        },
        reportNonIscritti: function (params) {

            var svc = new Fenealweb.db.reportStore();
            return svc.reportNonIscritti(params);
        }

    });

    Fenealweb.services = {};
    Fenealweb.services.securityService = securityService;
    Fenealweb.services.commonsService = commonsService;
    Fenealweb.services.dashboardService = dashboardService;
    Fenealweb.services.lavoratoriService = lavoratoriService;
    Fenealweb.services.aziendeService = aziendeService;
    Fenealweb.services.reportService = reportService;

    var listaNonIscritti = [
        {
            
            nome: 'Francesco Randazzo',
            fiscale: 'rndfnc77l14f052f',
            provincia: 'Bolzano',
            ente: 'CASSA EDILE',
            liberoAl: '31/12/2016',
            azienda: 'Alla Spa',
            iscrittoA: 'FILLEA',
                   
            
        },
        {
            nome: 'Francesco Randazzo',
            fiscale: 'rndfnc77l14f052f',
            provincia: 'Bolzano',
            ente: 'CASSA EDILE',
            liberoAl: '31/12/2016',
            azienda: 'Alla Spa',
            iscrittoA: 'FILLEA',
        },
        {
            nome: 'Francesco Randazzo',
            fiscale: 'rndfnc77l14f052f',
            provincia: 'Bolzano',
            ente: 'CASSA EDILE',
            liberoAl: '31/12/2016',
            azienda: 'Alla Spa',
            iscrittoA: 'FILLEA',
        },
        {
            nome: 'Francesco Randazzo',
            fiscale: 'rndfnc77l14f052f',
            provincia: 'Bolzano',
            ente: 'CASSA EDILE',
            liberoAl: '31/12/2016',
            azienda: 'Alla Spa',
            iscrittoA: 'FILLEA',
        }
    ];

    


}());


