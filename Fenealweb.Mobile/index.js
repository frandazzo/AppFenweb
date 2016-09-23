$(function() {
   

    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });
    
    if(DevExpress.devices.real().platform === "win") {
        $("body").css("background-color", "#000");
    }

    $(document).on("deviceready", function () {
        navigator.splashscreen.hide();
        if (window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });
    });

    function onNavigatingBack(e) {
        if(e.isHardwareButton && !Fenealweb.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                MSApp.terminateApp('');
                break;
        }
    }

    //var layoutSet = DevExpress.framework.html.layoutSets[Fenealweb.config.layoutSet];
    var navigation = Fenealweb.config.navigation;

    Fenealweb.emptyController = new DevExpress.framework.html.EmptyLayoutController;
    var layoutSet = [
                { controller: new DevExpress.framework.html.SlideOutController },
                { customResolveRequired: true, controller: Fenealweb.emptyController }
    ];


    $.when(
              $.getJSON("js/cldr/supplemental/ca-gregorian.json"),
              $.getJSON("js/cldr/supplemental/likelySubtags.json"),
              $.getJSON("js/cldr/supplemental/timeData.json"),
              $.getJSON("js/cldr/supplemental/weekData.json"),
              $.getJSON("js/cldr/supplemental/currencyData.json"),
              $.getJSON("js/cldr/supplemental/numbers.json"),
              $.getJSON("js/cldr/supplemental/numberingSystems.json")
            ).then(function () {
                // Normalize $.get results, we only need the JSON, not the request statuses.
                return [].slice.apply(arguments, [0]).map(function (result) {
                    return result[0];
                });
            }).then(Globalize.load).then(function () {
                $.get("js/localization/dx.all.it.json").done(function (data) {

                    Globalize.loadMessages(JSON.parse(data))
                    Globalize.locale('it');


                    Fenealweb.app = new DevExpress.framework.html.HtmlApplication({
                        namespace: Fenealweb,
                        layoutSet: layoutSet,
                        animationSet: DevExpress.framework.html.animationSets[Fenealweb.config.animationSet],
                        navigation: navigation,
                        commandMapping: Fenealweb.config.commandMapping,
                        navigateToRootViewMode: "keepHistory",
                        useViewTitleAsBackText: true
                    });


                    //imposto la richiestaq di uscita dalla vista nel caso di maschere che hanno la finalità
                    //di aggiornare un dato

                    Fenealweb.app.on("navigatingBack", function (e) {
                        if (!Fenealweb.app.currentViewModel)
                            return;
                        if (Fenealweb.app.currentViewModel.name.startsWith("edit")) {


                            if (!confirm("I dati non sono stati salvati. Uscire comunque?")) {
                                e.cancel = true;
                                return;
                            };

                            if (Fenealweb.app.currentViewModel)
                                if (Fenealweb.app.currentViewModel.cleanForm)
                                    Fenealweb.app.currentViewModel.cleanForm();

                            //var result = DevExpress.ui.dialog.confirm("I dati non sono stati salvati. Uscrire comunque?", "Annulla");
                            //result.done(function (dialogResult) {

                            //    if (dialogResult == "Confirmed") {
                            //        e.cancel = true;
                            //        return;
                            //    }
                            //});

                            //Execute the required code
                        };
                        Fenealweb.app.currentViewModel = null;
                    });


                    $(window).unload(function () {
                        Fenealweb.app.saveState();
                    });


                    Fenealweb.app.on("navigatingBack", onNavigatingBack);

                    Fenealweb.app.on("resolveLayoutController", function (args) {
                        if (args.viewInfo.viewName == 'login') {
                            args.layoutController = Fenealweb.emptyController;
                        }
                    });


                    var startupView = "login";
                    Fenealweb.app.router.register(":view/:id", { view: startupView, id: undefined });
                    Fenealweb.app.navigate();
                });
            });

   
   

});




function ExitApp() {

    var localStore = new Fenealweb.db.securityLocalStore();
    localStore.clearCredentials();
    Fenealweb.app.navigate({
        view: 'login',
        logout:true
    }, { root: true });


}

function NavigateToHome() {

    var localStore = new Fenealweb.db.securityLocalStore();
    localStore.getCredentials().done(function (data) {

        Fenealweb.app.navigate({
            view: 'home',
            loggedUser: data
        }, { root: true });

    });

}