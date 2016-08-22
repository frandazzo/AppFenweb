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

    


    Fenealweb.services = {};
    Fenealweb.services.securityService = securityService;
    Fenealweb.services.commonsService = commonsService;
    Fenealweb.services.dashboardService = dashboardService;

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
