(function(){
    angular.module('tofi', ['ui.router']);

    angular
        .module('tofi')
        .config(config)

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state("main", {
                url: "/",
                controller: 'mainCtrl',
                controllerAs: 'ctrl',
                templateUrl: "src/main/templates/main.html"
            })
            .state("login", {
                url: "/login",
                controller: 'loginCtrl',
                controllerAs: 'ctrl',
                templateUrl: "src/main/templates/login.html"
            })
            .state("signup", {
                url: "/signup",
                controller: 'signupCtrl',
                controllerAs: 'ctrl',
                templateUrl: "src/main/templates/signup.html"
            });
    }
})();

