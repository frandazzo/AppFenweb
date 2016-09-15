Fenealweb.iscrittiResult = function (params) {
    "use strict";


    var dataSource = new DevExpress.data.DataSource({
        pageSize: 20,
        load(loadOptions) {
            var d = $.Deferred();
            loadOptions = $.extend(loadOptions, params.id);
            var a = new Fenealweb.services.reportService();
            a.reportIscritti(loadOptions).done(function (data) {
                if (data.length == 0) {
                    viewModel.title('Lista iscritti');
                } else {
                    viewModel.title('Lista iscritti' + ' (' + data[0].results + ')');
                }
                d.resolve(data);
            });

            return d.promise();
        }
       

    });




    var viewModel = {
        title: ko.observable('Lista iscritti'),
        listOptions: {
            dataSource: dataSource,
            noDataText: 'Nessuna iscrizione trovata!',
           
            onItemClick: function (e) {
               
                Fenealweb.app.navigate({
                    view: 'quota1',
                    id: e.itemData
                });
            }
        }
    };

    return viewModel;
};