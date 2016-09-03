Fenealweb.lavoratori = function (params) {
    "use strict";


    var dataSource = new DevExpress.data.DataSource({
        load(loadOptions) {
            // return $.Deferred().resolve(listaLavoratori).promise();
            loadOptions = $.extend(loadOptions, JSON.parse(params.searchParams.replace('json:', '')));
            var a = new Fenealweb.services.lavoratoriService();
            var p = null;
            if (loadOptions.dbNazionaleSearch == true)
                p = a.searchLavoratoriDbNazionale(loadOptions);
            else
                p = a.searchLavoratori(loadOptions);


           
          
            return p;
        },
        //store: listaLavoratori,
        map: function (dataItem) {
            
            var comuneRes = dataItem.comuneResidenza;
            var provRes = dataItem.provinciaResidenza;
            var com = '';
            if (comuneRes && provRes)
                com =  comuneRes + ' (' + provRes + ')';
            else if (comuneRes)
                com = comuneRes;

            return {
                fiscale: dataItem.fiscale,
                completeName: dataItem.cognome.toUpperCase() + ' ' + dataItem.nome.toUpperCase() + ' (' + dataItem.dataNascita + ')',
                residenza: com,
                cell: dataItem.cellulare,
                showChevron: true,
                //badge: '<b>ciaoooooo</b>'
            };
        }

    });


    var viewModel = {
        listOptions: {
            dataSource: dataSource,
            noDataText: 'Nessun lavoratore trovato!',
            onItemSwipe: function (e) {
                DevExpress.ui.notify("The \"" + e.itemData.completeName + "\" item is swiped", "success", 1500);
            },
            onItemClick: function (e) {
                
                Fenealweb.app.navigate({
                    view: 'lavoratore',
                    fiscale: e.itemData.fiscale
                });
            }
        }
    };

    return viewModel;
};




