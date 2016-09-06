(function () {


    //Definisco un oggetto di base (LayerSupertype) che possiede al function per lereditarietà per l'ereditarietà
    function AObject() { }

    AObject.extend = function (obj) {
        return AObject.__doExtend(AObject, obj);
    };

    AObject.newInstance = function () {
        return new AObject();
    };

    AObject.__doExtend = function (superType, obj) {
        var inerithed = function (c) {
            if (c === "__AObject_prototype") {

            } else {
                if (!$.isFunction(obj.ctor)) {
                    obj.ctor = function () { superType.prototype.ctor.apply(this, arguments); };
                }

                obj.ctor.apply(this, arguments);
            }
        };

        inerithed.prototype = $.extend(new superType("__AObject_prototype"), obj);
        inerithed.super = superType.prototype;
        inerithed.newInstance = function () { return new inerithed(); };
        inerithed.extend = function (o) {
            return AObject.__doExtend(inerithed, o);
        };

        return inerithed;
    };



    AObject.prototype = {
        ctor: function () {

        }
    };


    var DBFactory = function () {
        this.basePath = Fenealweb.config.services.remoteApiBasePath;
    };

    DBFactory.prototype.createLoginService = function (data) {
        var route = Fenealweb.config.services.remoteLoginPath;

        return this.__doCreateService(false, route,data,null,'POST');
    };
    DBFactory.prototype.createService = function (params) { //isJsonContentType, route, data, token, method
        var defaults = {
            isJsonContentType: false,
            route: '',
            data: null,
            token: null,
            method: 'GET'
        };
        var data = $.extend(defaults, params);

        defaults.route = this.basePath + defaults.route;

        return this.__doCreateService(data.isJsonContentType, data.route, data.data, data.token, data.method);
    };

    DBFactory.prototype.__doCreateService = function (isJsonContentType, route, data, token, method) {

       

        //definisco il servizio
        var service = new AjaxService(token);

        //se sono dati json ne imposto il content type
        if (isJsonContentType)
            service.contentType= "application/json";
        else
            service.contentType = "application/x-www-form-urlencoded; charset=UTF-8";

        //se ci sono dati li trasformoi in stringa json
        //e li accodo al servizio
        if (isJsonContentType) {
            if (data) {
                if (typeof (data) == 'string') {

                    service.data = data;
                }
                else {
                    var stringified1 = JSON.stringify(data);
                    service.data = stringified1;
                }
            }
        } else {
            if (data)
                service.data = data;
        }
        
        
        service.url = route;
        if (method)
            service.method = method;
        return service;
    };



    


    //il servixio che devo creare deve avere la possibilità di :
    // -- inserire un eventuale token per le chiamate protette
    // -- deve avere una gestione centralizzata dell'errore legato al fatto di non essere loggato
    var AjaxService = AObject.extend({
        ctor: function (token) {
            AjaxService.super.ctor.call(this);
            //il token utilizzato per le chiamate protette
            this.token = token;

            this.data = {};
            //l'url a cui inviare i dati
            this.url = null;
            //il metodo utilizxzato di default
            this.method = "GET";
            //il tipo di dato che mi aspetto di ritorno
            this.dataType = "json";
            //il contentType utilizzato che puo anche essere application/x-www-form-urlencoded
            this.contentType = "application/json";
        },
        load : function () {
            var self = this;

            var d = $.Deferred();


            $.ajax({
                type: this.method,
                traditional: true,
                url: this.url,
                data: this.data,
                contentType: this.contentType,
                dataType: this.dataType,
                success: function (response) {
                    
                    //se non c'è una risposta dal server risolvo direttamente l'oggetto deferred
                    if (!response) {
                        d.resolve(response);
                        return;
                    }
                        
                    if (response.error === true) {
                        d.reject(response.message);
                        return;
                    }
                    //poiche tutte le chiamate restituiscono una silpme response
                    //...
                    d.resolve(response.value);
                },
                error: function (xhr, textStatus, errorThrown) {
                    var error = textStatus;
                    if (errorThrown)
                        error = error + " - " + errorThrown;

                    var merror = "Errore nella comunicazione con il server (" +  error +")";
                    
                    d.reject(merror);
                },
                beforeSend: function (xhr) {
                    
                    if (self.token) {
                      // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.setRequestHeader('TOKEN', self.token);
                      
                    }
                }
            });


            return d.promise();


        }
    });
 



    Fenealweb.core = {};
    Fenealweb.core.AjaxService = AjaxService;
    Fenealweb.core.DBFactory = DBFactory;
    Fenealweb.core.AObject = AObject;
})();