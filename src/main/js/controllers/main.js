(function(){
    angular
        .module('tofi')
        .controller('mainCtrl', mainCtrl);

    mainCtrl.$inject = ['$scope', '$http', '$state', 'LocalStorage'];
    function mainCtrl($scope, $http, $state, LocalStorage){
        auth_token = LocalStorage.retrieve('token');
        console.log(auth_token);

        if (auth_token) {
            google.charts.load('current', {'packages':['corechart']}); 
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
            });
            
            var getTickets = function () {
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
                });
            };
            getTickets();

            function getYesterday() {
            
                var today = new Date();
                var dd = today.getDate()-1;
                var mm = today.getMonth()+1; //January is 0!
                var yyyy = today.getFullYear();

                if(dd<10) {
                    dd='0'+dd
                } 

                if(mm<10) {
                    mm='0'+mm
                } 

                return dd+'.'+mm+'.'+yyyy;
            };
            
            function getNow() {
                var today = new Date();
                var hh = today.getHours();
                var mm = today.getMinutes(); //January is 0!
                var ss = today.getSeconds();

                if(hh<10) {
                    hh='0'+hh
                } 

                if(mm<10) {
                    mm='0'+mm
                } 

                if(ss<10) {
                    ss='0'+ss
                } 

                return hh+':'+mm+':'+ss;
            };

            var interval = null;
            function drawChart(tag) {
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'date');
                data.addColumn('number', 'lo');
                data.addColumn('number', 'open');
                data.addColumn('number', 'close');
                data.addColumn('number', 'hi');
                        
                var tmp = new Array(16).fill(null);
                data.addRows(tmp);
                var options = {
                    'title':tag,
                    legend:'none',
                    'colors': ['black'],
                    'axisTitlesPosition': 'in',
                    'candlestick': {
                        'fallingColor': {
                            'fill': 'red',
                            'stroke': 'black',
                            'strokeWidth': 1
                        },
                        'risingColor': {
                            'fill': 'lime',
                            'stroke': 'black',
                            'strokeWidth': 1
                        }
                    }
                };

                var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));
                chart.draw(data, options);
                open = 38;
                dowInt = 0;
                open = $scope.chart_data[0].price;
                interval = setInterval(function () {
                    console.log($scope.chart_data[dowInt].price);
                    close = $scope.chart_data[dowInt].price;
                    hi = Math.max(open, close) + (Math.random() * open * 0.0001);
                    lo = Math.min(open, close) - (Math.random() * open * 0.0001);
                    
                    data.addRow([getNow(), hi, open, close, lo]);
                    while (data.getNumberOfRows()>$scope.tickCount)
                        data.removeRow(0);
                    open = close;
                    chart.draw(data, options);
                    dowInt++;
                }, 1000);
            }

            $scope.details = function (tag, id){
                console.log(tag);
                console.log(getYesterday());
                $scope.selectedStock = tag;
                $scope.selectedStockId = id;
                $http({
                    method: 'GET',
                    url: '/stocks/'+tag+'/history',
                    params: {
                        'token': auth_token,
                        'from_date': getYesterday()
                    }
                }).then(function (response) {
                    $scope.chart_data = response.data;
                    drawChart(tag);
                }, function (response) {
                });
            };
            
            $scope.open_stock = function (id, bid){
                if (!$scope.stock_amount || !$scope.stock_price){
                    $scope.error = "Put correct price/amount"
                    return;
                }
                else $scope.error = null;
                    
                obj = {
                    'stock_id': id,
                    'count': $scope.stock_amount,
                    'price': $scope.stock_price,
                    'buy': bid
                };
                console.log(obj);
                $http({
                    method: 'POST',
                    url: '/tickets/',
                    data: obj,
                    params: {
                        'token': auth_token
                    }
                }).then(function (response) {
                    console.log(response.data);
                    
                    getTickets();
                }, function (response) {
                    $scope.error = "Unknown server error";
                });
            };
            
            $scope.hide_details = function (){
                $scope.selectedStock = null;
                clearInterval(interval);
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

            $scope.stock_name_by_id = function (id){
                if (!id) return;
                for (var i=0; i<$scope.stocks.length; i++) {
                    if ($scope.stocks[i].id==id)
                        return $scope.stocks[i].code;
                }
            };
            
            $scope.logOut = function (){
                LocalStorage.remove('token');
                $state.go('login');
            };

            $scope.close_stock = function (id) {
                $http({
                    method: 'DELETE',
                    url: '/tickets/'+id,
                    params: {
                        'token': auth_token
                    }
                }).then(function (response) {
                    getTickets();
                }, function (response) {
                });
            };
        }
        else {
            $state.go('login')
        }
    };
})();
