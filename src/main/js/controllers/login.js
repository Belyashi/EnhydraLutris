(function(){
    angular
        .module('tofi')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$http'];
    function loginCtrl($scope, $http){
        $scope.signIn = function () {
            obj = {
                "username": $scope.username,
                "password": $scope.password
            };
            console.log();
            $http.post('/auth/login', obj);
        };
    };
})();