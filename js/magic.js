/**
 * Created by camer_000 on 9/3/2014.
 */
(function () {

    var app = angular.module('business', ['ngAnimate','ui.bootstrap']);


    app.controller('productController', ['$http','$scope','$document', function ($http,$scope,$document) {

        scop = this;
        /*
         declares productController.products to be the json array
         */
        $http.get('js/array.json').then(function (res) {
            scop.products = res.data;
        });
        $http.get('js/groups.json').then(function (res) {
            scop.groups = res.data;
        });
        $http.get('js/featured.json').then(function (res) {
            scop.featured = res.data;
        });

        this.count = 0;
        this.basket = [];
        this.customer = {};
        this.customer.email = "";
        this.customer.num = "";
        this.customer.restaurant = "";
        this.customer.product = [];
        this.customer.quantities = [];
        this.customer.comments = "";
        this.category = "Featured";
        this.searchText = "";
        this.searchTextAll = "";
        this.canEdit = false;
        this.orderConfirmed = false;



        //this gets the cookie contents and returns them, if blank it returns a string of "nothing"
        this.getCookie = function () {
            var name = "rollingSharpener" + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "nothing";

        };
        this.getCookies = function(Cname) {
            var name = Cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "nothing";
        };

        this.checkCookie = function () {
            //if page has no cookie, create a cookie, else, dissect the cookie and add contents into basket then populate the page
            var cookieValue = this.getCookie();
            if (cookieValue === "nothing") {
                this.setCookie();
                /*remove first empty item in array*/
                if (this.basket[0] === "") {
                    this.basket.shift();
        }
                if(this.customer.quantities[0] =="" || isNaN(this.customer.quantities[0])){
                    this.customer.quantities.shift();
                }

        }

        else {
                // else, dissect the cookie and add contents into basket
                //this line turns the cookie into an array
                this.basket = this.getCookie().split(",");
                if (this.basket[0] == "") {
                    this.basket.shift();
                }
                /*console.log(getCookie("rollingSharpenerQuantities"));
                console.log( $document.prop( "cookie" ) );
                console.log( $document[ 0 ].cookie );*/
                if(this.customer.quantities[0] ==="" || isNaN(this.customer.quantities[0])){
                    this.customer.quantities.shift();
                }

            }
            this.initProducts();
        };
        $scope.$watch(function(){
                var name = "rollingSharpener" + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
                }
                return "nothing";}, function(newValue, oldValue){
                if(newValue != oldValue){

            scop.checkCookie();
                    /*need to make watcher run more frequently than on a click*/
        }}
            );


        this.initQuantities = function(){

          for(var i=0; i<=this.customer.product.length-1;i++){
              if(this.customer.quantities[i] == null) {
                  this.customer.quantities[i] = 1;
              }
          }
        };

        this.initProducts = function () {
            /*retrieves JSON products array, for each object in array, determines if object name is in basket
             * Populates customer.product array that checkout will display*/
            $http.get("js/array.json").then(
                //success function
                function (results) {

                    scop.customer.product = [];
                    angular.forEach(results.data, function (u) {


                            if (scop.basket.indexOf(u.name) !== -1) {
                                /*where ever the value is in the basket, put it in that index also of the products array but as an object
                                 * this initializes correctly*/
                                scop.customer.product[scop.basket.indexOf(u.name)] = u;


                            }


                        },

                        //error function
                        function (err) {

                        });

                });

        };


        /*class of product boxes is tied to this function, returns name of class based on whether it is in this.basket*/
        this.getClass = function (name) {
            if (this.basket.indexOf(name) <= -1) {
                return "box";
            }
            else {
                return "boxSelected";
            }
        };



        /*sets a cookie with the name of "rollingSharpener"
         * assigns it a value of this.basket
         * expires in 10 days*/
        this.setCookie = function () {
            var d = new Date();
            //Cookie for 10 years
            d.setTime(d.getTime() + (3600 * 1000 * 24 * 365 * 10));
            var expires = "expires=" + d.toUTCString();
            document.cookie = "rollingSharpener" + "=" + this.basket + "; " + expires;
            document.cookie = "rollingSharpenerQuantities" + "=" + this.customer.quantities + ";" + expires;

        };


        /*receives name of product selected
         * pushes it into this.basket
         * then updates the cookie*/
        this.addProduct = function (product) {
            this.basket.push(product);
            this.customer.quantities.push(1);
            /*should not need this line to change class on selection, but breaks when removed, same for next method*/
            this.setCookie();
        };

        /*receives name of product
         * removes name from this.basket
         * then updates the cookie*/
        this.removeProduct = function (product) {

            this.customer.quantities.splice(this.basket.indexOf(product), 1);
            this.basket.splice(this.basket.indexOf(product), 1);
            this.setCookie();

        };

        this.removeProductCheckout = function (product) {

            var a = this.basket.indexOf(product);
            this.customer.quantities.splice(a,1);
            this.basket.splice(a, 1);

            this.customer.product.splice(a, 1);

            this.setCookie();
        };

        /*receives name of product selected
         * if it is not found in this.basket, it sends the name to addProduct
         * if it finds the name in this.basket, it sends the name to removeProduct*/
        this.selectProduct = function (id) {
            if (this.basket.indexOf(id) < 0) {
                this.addProduct(id);
            }
            else {
                this.removeProduct(id);
            }

        };


        this.isInBasket = function(id){
            return this.basket.indexOf(id) < 0;
        };


        this.initBasketQuantity = function(){

             var l = this.getCookies("rollingSharpenerQuantities").split(',');
            for(var i=0; i<l.length; i++) {
                l[i] = parseInt(l[i]); }
            this.customer.quantities = l;

        };

        this.formSubmit = function () {


            if (this.count === 0) {
                this.count++;
                lol = this;
                $http({
                    method: 'POST',
                    url: 'php/SendOrder.php',
                    headers: {'Content-Type': 'application/json.'},
                    data: {customer: lol.customer}
                }).
                    success(function () {
                        window.location = "invoice.html";
                    })


            }
        };
        this.toggleEdit = function(){
            if(this.canEdit){
                this.canEdit = false;
            }
            else{this.canEdit = true;}
        }

        this.toggleOrderConfirmed = function(){
            if(this.orderConfirmed){
                this.orderConfirmed = false;
            }
            else{this.orderConfirmed = true;}
        }



    }]);

app.controller('ModalDemoCtrl', function ($scope, $modal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (product) {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                items: function () {
                    return product;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items
        };
        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {

            $modalInstance.dismiss('cancel');
        };
    });




})();