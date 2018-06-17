(function () {

  var app = angular.module("cryptographyApp", ["ngRoute"]);

  var random = function(limit) {
    return Math.floor(Math.random()*limit+1)
  }

  var sumOfDigits = function(input) {
    while (input >= 10) {
      var str = input.toString();
      var sum = 0;
      for (var i=0; i<str.length; i++) {
        sum += parseInt(str.charAt(i), 10);
      }
      input = sum;
    }
    return input;
  }


  app.factory('helperMethods', function(){
    return {
      dummy: function(menuItem) {
        return true;
      }
    };
  });

  app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "main.html"
    })
    .when("/xor", {
      templateUrl : "xor.html"
    })
    .when("/hash", {
      templateUrl : "hash.html"
    })
    .when("/symmetric-keys", {
      templateUrl : "symmetric-keys.html"
    })
    .when("/hmac", {
      templateUrl: "hmac.html"
    })
    .when("/key-exchange", {
      templateUrl: "key-exchange.html"
    })
    .when("/assymetric-keys", {
      templateUrl: "assymetric-keys.html"
    })
    .when("/digital-signature", {
      templateUrl: "digital-signature.html"
    })
    .when("/block-chain", {
      templateUrl: "block-chain.html"
    });
  });

  app.controller("navigationController", function($scope, $location, helperMethods) {
    $scope.menuItems = [{
      prev: '',
      name: 'XOR',
      value: 'xor',
      next: 'hash'
    }, {
      prev: 'xor',
      name: 'Hash',
      value: 'hash',
      next: 'symmetric-keys'
    }, {
      prev: 'hash',
      name: 'Symmetric Key Encryption',
      value: 'symmetric-keys',
      next: 'key-exchange'
    }, {
      prev: 'symmetric-keys',
      name: 'Key Exchange',
      value: 'key-exchange',
      next: 'hmac'
    }, {
      prev: 'key-exchange',
      name: 'HMAC',
      value: 'hmac',
      next: 'assymetric-keys'
    }, {
      prev: 'hmac',
      name: 'Asymmetric Key Encryption',
      value: 'assymetric-keys',
      next: 'digital-signature'
    }, {
      prev: 'assymetric-keys',
      name: 'Digital Signature',
      value: 'digital-signature',
      next: 'block-chain'
    }, {
      prev: 'digital-signature',
      name: 'Block Chain',
      value: 'block-chain',
      next: ''
    }];
    $scope.activeMenu = "";
    $scope.setActive = function(menuItem) {
      $scope.activeMenu = menuItem.value;
    };
    $scope.href = function(menuItem) {
      return '#!' + menuItem.value;
    };
    $scope.start = function() {
      $location.path("xor");
      $scope.activeMenu = "xor";
    };
    $scope.setActiveMenuByName = function(menuItem) {
      for (var i=0; i<$scope.menuItems.length; i++) {
        var activeMenuItem = $scope.menuItems[i];
        if (activeMenuItem.value === menuItem) {
          $scope.activeMenu = menuItem.value;
          break;
        }
      }
    };
  });


  app.controller("xorController", function ($scope, helperMethods) {
    $scope.a = random(100);
    $scope.b = random(100);
    $scope.xor = function() {
      $scope.c = $scope.a ^ $scope.b;
    };
  });


  app.controller("symmetricKeyController", function ($scope, helperMethods) {
    $scope.input = random(100);
    $scope.key = random(100);
    $scope.encryptOrDecrypt = function() {
      $scope.output = $scope.input ^ $scope.key;
    };
  });


  app.controller("hashController", function ($scope, helperMethods) {
    $scope.input = random(100);
    $scope.hashfun = "sumOfDigits";
    $scope.hash = function() {
      if ($scope.hashfun === "sumOfDigits") {
        $scope.output = sumOfDigits($scope.input);
      } else {
        $scope.output = hex_md5($scope.input.toString());
      }
    };
  });

  app.controller("hmacController", function ($scope, helperMethods) {
    $scope.input = random(100);
    $scope.key = random(100);
    $scope.hashfun = "sumOfDigits";
    $scope.hmac = function() {
      if ($scope.hashfun === "sumOfDigits") {
        var s = sumOfDigits(parseInt($scope.key + "" + $scope.input));
        $scope.output = sumOfDigits(parseInt($scope.key + "" + s));
      } else {
        var s = hex_md5($scope.key + "" + $scope.input);
        $scope.output = hex_md5($scope.key + "" + s);
      }
    };
  });


  app.controller("keyExchangeController", function ($scope, helperMethods) {
    $scope.a = 4;
    $scope.b = 3;
    $scope.p = 23;
    $scope.g = 5;

    $scope.gPowerXmodP = function(x) {
      return Math.floor(Math.pow($scope.g, x)) % $scope.p;
    };

    $scope.xPowerYmodP = function(x, y) {
      return Math.floor(Math.pow(x, y)) % $scope.p;
    };

  });


  app.controller("asymmetricKeyController", function ($scope, helperMethods) {
    $scope.a = random(50);
    $scope.b = random(50);
    $scope.a1 = random(50);
    $scope.b1 = random(50);
    $scope.input = random(50);
    $scope.output = "";

    $scope.publicKey = function(a, b, a1, b1) {
      var M =  (a * b) -1;
      var e =  (a1 * M) + a;
      var d =  (b1 * M) + b;
      var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
      return "(" + n + ", " + e + ")";
    };
    $scope.privateKey = function(a, b, a1, b1) {
      var M =  (a * b) -1;
      var e =  (a1 * M) + a;
      var d =  (b1 * M) + b;
      var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
      return d;
    };
    $scope.encrypt = function(a, b, a1, b1) {
      var M =  (a * b) -1;
      var e =  (a1 * M) + a;
      var d =  (b1 * M) + b;
      var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
      $scope.output = ($scope.input * e) % n;
    };
    $scope.decrypt = function(a, b, a1, b1) {
      var M =  (a * b) -1;
      var e =  (a1 * M) + a;
      var d =  (b1 * M) + b;
      var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
      $scope.output = ($scope.input * d) % n;
    };

  });


  app.controller("digitalSignatureController", function ($scope, helperMethods) {
    $scope.a = random(50);
    $scope.b = random(50);
    $scope.a1 = random(50);
    $scope.b1 = random(50);
    $scope.input = random(50);
    $scope.hashfunS = "sumOfDigits";
    $scope.hashfunV = "sumOfDigits";
    $scope.signatureInput = "";
    $scope.signatureOutput = "";
    $scope.output = "";

    $scope.publicKey = function(a, b, a1, b1) {
      var M =  (a * b) -1;
      var e =  (a1 * M) + a;
      var d =  (b1 * M) + b;
      var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
      return "(" + n + ", " + e + ")";
    };
    $scope.privateKey = function(a, b, a1, b1) {
      var M =  (a * b) -1;
      var e =  (a1 * M) + a;
      var d =  (b1 * M) + b;
      var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
      return d;
    };
    $scope.encrypt = function(a, b, a1, b1, p) {
      var M =  (a * b) -1;
      var e =  (a1 * M) + a;
      var d =  (b1 * M) + b;
      var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
      return (p * e) % n;
    };
    $scope.decrypt = function(a, b, a1, b1, c) {
      var M =  (a * b) -1;
      var e =  (a1 * M) + a;
      var d =  (b1 * M) + b;
      var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
      return (c * d) % n;
    };
    $scope.sign = function() {
      $scope.signatureOutput="sig-out";
      $scope.signatureInput="sig-out";
    };
    $scope.verify = function() {
      $scope.output="false";
    };

  });


})();
