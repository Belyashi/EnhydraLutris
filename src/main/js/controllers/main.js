(function(){
    angular
        .module('tofi')
        .controller('mainCtrl', mainCtrl);

    mainCtrl.$inject = ['$scope', '$http', '$state', 'LocalStorage'];
    function mainCtrl($scope, $http, $state, LocalStorage){
        auth_token = LocalStorage.retrieve('token');
        console.log(auth_token);
        if (auth_token) {
            $http({
                method: 'GET',
                url: '/stocks/',
                params: {
                    'token': auth_token
                }
            }).then(function (response) {
                console.log(response.data);
                $scope.stocks = response.data;
            }, function (response) {
                $scope.error = "Unknown server error";
                //LocalStorage.remove('token');
            });
            
            $http({
                method: 'GET',
                url: '/tickets',
                params: {
                    'token': auth_token
                }
            }).then(function (response) {
                console.log(response.data);
                $scope.tickets = response.data;
            }, function (response) {
                $scope.error = "Unknown server error";
                //LocalStorage.remove('token');
            });
            
            $scope.details = function (tag){
                console.log(tag);
                $scope.selectedStock = tag;
            };
            
            $scope.hide_details = function (){
                $scope.selectedStock = null;
            };
            
            $scope.stock_code = function (id){
                if (!id) return;
                for (var i=0; i<$scope.stocks.length; i++) {
                    if ($scope.stocks[i].tag==id)
                        return $scope.stocks[i].code;
                }
            };
            
            $scope.stock_name = function (id){
                if (!id) return;
                for (var i=0; i<$scope.stocks.length; i++) {
                    if ($scope.stocks[i].tag==id)
                        return $scope.stocks[i].code;
                }
            };
            
            $scope.logOut = function (){
                LocalStorage.remove('token');
                $state.go('login');
            }
        }
        else {
            $state.go('login')
        }
    };
})();