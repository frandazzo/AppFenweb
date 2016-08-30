Fenealweb.searchCompanies = function (params) {
    "use strict";


    var  dataSource = new DevExpress.data.DataSource({
        load(loadOptions) {
            
            var a = new Fenealweb.services.aziendeService();
            var p = a.searchAziende(loadOptions.searchValue);
          
            return p;
        }
    });



    var viewModel = {
        
        listOptions: {
            dataSource: dataSource,
            nodataText:'Nessuna azienda trovata',
            height: "95%",
            itemTemplate: function (data) {
                return $("<div>").text(data.descrizione).css('font-size', '17px');
            },
            onItemClick: function (e) {

                Fenealweb.app.navigate({
                    view: 'azienda',
                    fiscale: e.itemData.id
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