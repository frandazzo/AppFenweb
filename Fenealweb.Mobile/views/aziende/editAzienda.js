Fenealweb.editAzienda = function (params) {
    "use strict";
    
    var azienda = params.id;
    var previousViewKey = params.viewInfoKey;
    var updateOperation = azienda.id != "0" ? true : false;

    var title = ko.observable('Aggiorna azienda');
    if (azienda.id == "0")
        title('Crea azienda');


    var loadPanelVisibile = ko.observable(false);
    var geoProvinceSelected = ko.observable(azienda.provincia);
    var comuneValue = ko.observable(azienda.comune);
 

    var comuniDataSource = new DevExpress.data.DataSource({
        load:function(loadOptions) {

            if (!loadOptions.searchValue) {

                //se non cè un valore lo recupero dall'editor della provincia
                //solo se è nullo anche quello rispondo cin una trivial promise...
                var formInstance = $('#form').dxForm('instance');
                var prov = formInstance.getEditor('provincia').option('value');
               
                if (!prov) {
                    var d = $.Deferred();
                    return d.resolve([]).promise();
                }


                var a = new Fenealweb.services.commonsService();
                return a.getGeoComuni(prov);
            }
            var a = new Fenealweb.services.commonsService();
            return a.getGeoComuni(loadOptions.searchValue);
        },
        byKey:function(key) {
            var d = {
                label: key
            }
            return $.Deferred().resolve(d).promise();
        }
    });


    var viewModel = {
        cleanForm: function () {
            var formInstance = $('#form').dxForm('instance');
            formInstance.resetValues();
            formInstance.option('formData', azienda);
        },
        loadOptions: {
            visible: loadPanelVisibile,
            showIndicator: true,
            showPane: true,
            shading: true,
            closeOnOutsideClick: false,
            shadingColor: "rgba(0,0,0,0.4)",
            position: { of: "body" }
        },
        title: title,
        save: function () {

            var formInstance = $('#form').dxForm('instance');
            var data = formInstance.option('formData');
            //valido
            var res = formInstance.validate();
            if (!res.isValid) {
                console.log(data);
                DevExpress.ui.notify("Controllare alcuni valori mancanti", "error", 2500);
                return;
            }
            loadPanelVisibile(true);

            data.id = azienda.id;

            

            var svc = new Fenealweb.services.aziendeService();
            svc.saveAzienda(data)
            .done(function () {
                Fenealweb.app.currentViewModel = null;
                loadPanelVisibile(false);
                //se creo un nuovo elemento
                //vado direttemtne alla vista per il caricamento dei dati
                //altrimenti vado indietro

                if (updateOperation) {

                    //nel caso sto aggiornando devo fare attenzione a tornare indietro
                    //poichè la chiave di identificazione della vista è la descrizione dell'azienda e
                    //non il suo id. pertanto una varizaione della descrizione fa ripartire una query che se non trova
                    //la descrizione ne crea una nuova.... regola del server
                    if (azienda.descrizione != data.descrizione) {

                        ////rimuovo la vista precedetne dallla cache
                        //var cache = Fenealweb.app.viewCache;
                        //cache.removeView(previousViewKey);
                        

                        Fenealweb.app.navigate({
                            view: 'azienda',
                            id: data.descrizione
                        }, { target: 'back' });
                    } else {
                        Fenealweb.app.back();
                    }


                    
                } else {
                    var descr = data.descrizione;
                    viewModel.cleanForm();
                    Fenealweb.app.navigate({
                        view: 'azienda',
                        id: descr
                    }, { target: 'current' });

                }
            })
            .fail(function (error) {
                loadPanelVisibile(false);
                DevExpress.ui.notify(error, "error", 2500);
            });

        },
        viewShown: function (e) {
            Fenealweb.app.currentViewModel = e.viewInfo.model;
        },

        formOptions: {
            colCount: 2,
            formData: azienda,

            items: [
                {
                    itemType: "group",
                    caption: "Dati anagrafici",
                    items: [
                       {
                           dataField: "descrizione",
                           editorOptions: {
                               placeholder: "Ragione sociale"
                           },
                           validationRules: [{
                               type: "required",
                               message: "Obbligatorio"
                           }]
                       },
                       {
                           dataField: "provincia",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: new DevExpress.data.DataSource({
                                   load: function (loadOptions) {
                                       var a = new Fenealweb.services.commonsService();
                                       return a.getGeoProvinces();
                                   },
                                   byKey: function (key) {
                                       var d = {
                                           label: key
                                       }
                                       return $.Deferred().resolve(d).promise();
                                   }
                               }),
                               valueExpr: 'label',
                               displayExpr: 'label',
                               placeholder: 'Provincia',
                               onValueChanged: function (e) {
                                   var idProvincia = e.value;
                                   //comuneValue('');
                                   var formInstance = $('#form').dxForm('instance');
                                   formInstance.getEditor('comune').option('value', '');
                                   comuniDataSource.searchValue(idProvincia);
                                   comuniDataSource.load();
                               },
                               value: geoProvinceSelected
                           }
                       },
                       {
                           dataField: "comune",
                           editorType: "dxSelectBox",
                           editorOptions: {
                               dataSource: comuniDataSource,
                               placeholder: 'Comune',
                               valueExpr: 'label',
                               displayExpr: 'label',
                               value: comuneValue
                           }
                       },
                       {
                           dataField: "indirizzo",
                           editorOptions: {
                               placeholder: 'Indirizzo'
                           }
                       },
                     {
                         dataField: "cap",
                         editorOptions: {
                             placeholder: 'Cap'
                         }
                     }]
                }
               
               
            ],



        },

    };

    return viewModel;
};