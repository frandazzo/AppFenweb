Fenealweb.searchCompanies = function (params) {
    "use strict";


    var dataSource = new DevExpress.data.DataSource({
        paginate:false,
        load: function (loadOptions) {
            
            var a = new Fenealweb.services.aziendeService();
            var p = a.searchAziende(loadOptions.searchValue);
          
            return p;
        }
    });



    var viewModel = {
        create: function(){
            var lav = {
                id: '0',
                descrizione: '',
                provincia: '',
                comune: '',
                indirizzo: '',
                cap: '',
            };


            Fenealweb.app.navigate({
                view: 'editAzienda',
                id: lav
            });
        },
        listOptions: {
            
            dataSource: dataSource,
            bounceEnabled: false,
            nodataText:'Nessuna azienda trovata',
            height: "95%",
           
            onItemClick: function (e) {

                Fenealweb.app.navigate({
                    view: 'azienda',
                    id: e.itemData.descrizione
                });
            }
        },
        searchOptions: {
            //valueChangeEvent: "keyup",
            placeholder: "Cerca",
            mode: "search",
            onValueChanged: function (args) {
                dataSource.searchValue(args.value);
                dataSource.load();
            }
        }

    };

    return viewModel;
};