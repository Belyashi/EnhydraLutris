(function(){
    angular
        .module('tofi')
        .controller('signupCtrl', signupCtrl);

    signupCtrl.$inject = ['$scope', '$http'];
    function signupCtrl($scope, $http){
        $scope.signUp = function () {
            if ($scope.password == $scope.password_confirm) {
                obj = {
                    "username": $scope.username,
                    "password": $scope.password
                };
                console.log();
                $http.post('/auth/register', obj);
            }
            else {
                $scope.error = "Password and confirm must match";
            }
        };
    };
})();