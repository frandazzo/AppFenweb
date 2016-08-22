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


   
    Fenealweb.app = new DevExpress.framework.html.HtmlApplication({
        namespace: Fenealweb,
        layoutSet: layoutSet,
        animationSet: DevExpress.framework.html.animationSets[Fenealweb.config.animationSet],
        navigation: navigation,
        commandMapping: Fenealweb.config.commandMapping,
        navigateToRootViewMode: "keepHistory",
        useViewTitleAsBackText: true
    });
    

    $(window).unload(function() {
        Fenealweb.app.saveState();
    });

    
    Fenealweb.app.on("navigatingBack", onNavigatingBack);

    Fenealweb.app.on("resolveLayoutController", function (args) {
        if (args.viewInfo.viewName == 'login') {
            args.layoutController =  Fenealweb.emptyController;
        }
    });


    var startupView = "login";
    Fenealweb.app.router.register(":view/:id", { view: startupView, id: undefined });
    Fenealweb.app.navigate();

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