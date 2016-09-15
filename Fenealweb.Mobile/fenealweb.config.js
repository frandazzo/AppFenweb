// NOTE object below must be a valid JSON
window.Fenealweb = $.extend(true, window.Fenealweb, {
	"config": {
		"layoutSet": "slideout",
		"animationSet": "default",
		"navigation": [
			{
				"title": "Home",
				"onExecute": function () {
                NavigateToHome();
            },
				"icon": "home"
			},
			{
				"title": "Lavoratori",
				"onExecute": "#searchWorkers",
				"icon": "group"
			},
			{
				"title": "Lavoratori db nazionale",
				"onExecute": "#searchGlobalWorkers",
				"icon": "globe"
			},
			{
				"title": "Aziende",
				"onExecute": "#searchCompanies",
				"icon": "fa fa-building-o"
			},
			{
				"title": "Report iscritti",
				"onExecute": "#reportIscritti",
				"icon": "fa fa-line-chart"
			},
			{
				"title": "Report non iscritti",
				"onExecute": "#reportNonIscritti",
				"icon": "fa fa-bar-chart"
			},
			{
				"icon": "fa fa-sign-out",
				"title": "Esci",
				"onExecute": function () {
                ExitApp();
            }
			}
		],
		"services": {
			"remoteLoginPath": "http://www.fenealgest.it:8080/auth/remotelogin",
			"remoteApiBasePath": "http://www.fenealgest.it:8080/"
		},
		"commandMapping": {
			"ios-header-toolbar": {
				"commands": [
					{
						"id": "checkTesseramento",
						"location": "menu"
					},
					{
						"id": "delega",
						"location": "menu"
					},
					{
						"id": "nuovadelega",
						"location": "menu"
					},
					{
						"id": "nuovadelegamagazzino",
						"location": "menu"
					},
					{
						"id": "nuovaricerca",
						"location": "menu"
					},
					{
						"id": "newSearch",
						"location": "menu"
					}
				]
			},
			"android-header-toolbar": {
				"commands": [
					{
						"id": "checkTesseramento",
						"location": "menu"
					},
					{
						"id": "delega",
						"location": "menu"
					},
					{
						"id": "nuovadelega",
						"location": "menu"
					},
					{
						"id": "nuovadelegamagazzino",
						"location": "menu"
					},
					{
						"id": "nuovaricerca",
						"location": "menu"
					},
					{
						"id": "newSearch",
						"location": "menu"
					}
				]
			},
			"generic-header-toolbar": {
				"commands": [
					{
						"id": "checkTesseramento",
						"location": "menu"
					},
					{
						"id": "delega",
						"location": "menu"
					},
					{
						"id": "nuovadelega",
						"location": "menu"
					},
					{
						"id": "nuovadelegamagazzino",
						"location": "menu"
					},
					{
						"id": "nuovaricerca",
						"location": "menu"
					},
					{
						"id": "newSearch",
						"location": "menu"
					}
				]
			},
			"win10-phone-appbar": {
				"commands": [
					{
						"id": "checkTesseramento",
						"location": "menu"
					},
					{
						"id": "delega",
						"location": "menu"
					},
					{
						"id": "nuovadelega",
						"location": "menu"
					},
					{
						"id": "nuovadelegamagazzino",
						"location": "menu"
					},
					{
						"id": "nuovaricerca",
						"location": "menu"
					},
					{
						"id": "newSearch",
						"location": "menu"
					}
				]
			},
			"android-simple-toolbar": {
				"commands": [
					{
						"id": "checkTesseramento",
						"location": "menu"
					},
					{
						"id": "delega",
						"location": "menu"
					},
					{
						"id": "nuovadelega",
						"location": "menu"
					},
					{
						"id": "nuovadelegamagazzino",
						"location": "menu"
					},
					{
						"id": "nuovaricerca",
						"location": "menu"
					},
					{
						"id": "newSearch",
						"location": "menu"
					}
				]
			}
		}
	}
});
