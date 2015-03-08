/**
 * Created by camer_000 on 11/3/14.
 */
(function () {
    var app = angular.module('authenticate', []);

    app.controller('AuthenticationController', ['$http','$scope', function ($http,$scope) {

        /*
         declares productController.products to be the json array
         */
        $http.get('js/array.json').then(function (res) {
            $scope.products = res.data;
        });
        $http.get('js/groups.json').then(function (res) {
            $scope.groups = res.data;
        });

        $scope.form = {};
        $scope.form.pass = "";
        $scope.count = 0;
        $scope.error = "";
        $scope.attemptsLeft = 5;
        $scope.authenticated = false;
        $scope.selectionChosen = false;
        $scope.add = false;
        $scope.remove = false;
        $scope.name = "";
        $scope.Vendor = "";
        $scope.Group = "";
        $scope.SubGroup = "";
        $scope.PartNumber = "";
        $scope.MfgPN = "";
        $scope.UM = "";
        $scope.id = "";
        $scope.pic = "pics/generic_product.jpg";
        $scope.lengthOfProducts = 0;

        $scope.named = function(n){

            var s = "";
            while(n >= 0) {
                s = String.fromCharCode(n % 26 + 97) + s;
                n = Math.floor(n / 26) - 1;
            }
            s = s.toUpperCase();
            $scope.name = s;
            return s;
        };

        $scope.productsLength = function () {
            /*retrieves JSON products array, for each object in array, determines if object name is in basket
             * Populates customer.product array that checkout will display*/
            $http.get("js/array.json").then(
                //success function
                function (results) {

                    $scope.product = [];

                    angular.forEach(results.data, function (u) {

                                $scope.lengthOfProducts++;

                        },

                        //error function
                        function (err) {

                        });

                });

        };

        $scope.formSubmit = function () {


            if ($scope.count < 4) {
                $scope.count++;
                $http({
                    method: 'POST',
                    url: 'php/Authenticate.php',
                    headers: {'Content-Type': 'application/json.'},
                    data: {form: $scope.form}
                }).
                    success(function (data) {
                        if(!data.success){
                            $scope.attemptsLeft--;
                            $scope.error = "Incorrect Password " + $scope.attemptsLeft + " attempts remaining.";

                        }
                        else{
                            $scope.authenticated = true;
                            $scope.newProduct();

                        }
                    })


            }
            else{
                $scope.error = "Too many failed attempts";
            }
        };


        $scope.newProduct = function(){
            $http.get('js/array.json').then(function (res) {
                $scope.products = res;
            });
            console.log($scope.products);
            $scope.newProduct = {};
            $scope.newProduct = {"name":$scope.id,"Vendor":$scope.Vendor,"Group":$scope.Group,"SubGroup":$scope.SubGroup,"PartNumber":$scope.PartNumber,"MfgPN":$scope.MfgPN,"UM":$scope.UM,"id":$scope.name,"pic": $scope.pic};

            $scope.products.push($scope.newProduct);
            console.log($scope.products);
            /*$http.post('js/array.json',$scope.products).success(function(){
                console.log($scope.newProduct);
                console.log($scope.products);
            })*/

        }
    }]);

    app.directive('passwordAuth',function(){

        return{
            transclude: true,
            restrict: 'E',
            templateUrl: 'directives/password.html'

        }

    });
    app.directive('addProductTable',function(){

        return{
            transclude: true,
            restrict: 'E',
            templateUrl: 'directives/addProductTable.html'

        }

    });

})();