(function(){
    angular
        .module('tofi')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$http', '$state', 'LocalStorage'];
    function loginCtrl($scope, $http, $state, LocalStorage){
        $scope.signIn = function () {
            obj = {
                "username": $scope.username,
                "password": $scope.password
            };
            console.log(obj);
            $http({
                method: 'POST',
                url: '/auth/login',
                data: obj
            }).then(function (response) {
                if (response.data['error'])
                    if (response.data['error']=='auth_failed')
                        $scope.error = 'Username\/Password is invalid';
                    else
                        $scope.error = 'Unknown error: '+response.data['error'];
                else {
                    console.log(response.data['token']);
                    LocalStorage.store('token', response.data['token']);
                    $state.go('main');
                }
            }, function (response) {
                $scope.error = "Unknown server error";
            });
        };
    };
})();