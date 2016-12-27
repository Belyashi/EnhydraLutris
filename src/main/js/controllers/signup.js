(function(){
    angular
        .module('tofi')
        .controller('signupCtrl', signupCtrl);

    signupCtrl.$inject = ['$scope', '$http', '$state', 'LocalStorage'];
    function signupCtrl($scope, $http, $state, LocalStorage){
        $scope.signUp = function () {
            if ($scope.password == $scope.password_confirm) {
                obj = {
                    "username": $scope.username,
                    "password": $scope.password
                };
                console.log(obj);
                $http({
                    method: 'POST',
                    url: '/auth/register',
                    data: obj
                }).then(function (response) {
                    console.log(response.data['token']);
                    LocalStorage.store('token', response.data['token']);
                    $state.go('main');
                }, function (response) {
                    $scope.error = "Unknown server error";
                });
            }
            else {
                $scope.error = "Password and confirm must match";
            }
        };
    };
})();