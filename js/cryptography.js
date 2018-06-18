(function () {

    var app = angular.module("cryptographyApp", ["ngRoute"]);

    app.directive('fixHex', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                elem.on("blur", function() {
                    elem.val(fixHex(elem.val()));
                });
            }
        };
    });

    var random = function (limit) {
        return Math.floor(Math.random() * limit + 1)
    };

    var random16 = function(limit) {
      var output = random(limit).toString(16);
        if (output.length % 2 === 1) {
            output = "0" + output;
        }
        return output;
    };

    var fixHex = function (input) {
        console.log("fixHex", input);
        if (input == null || input.toString() === "") {
            return input;
        }
        while (input.length %2 !== 0) {
            input = "0" + input;
        }
        while (input.length > 2 && input.substr(0, 2) === "00") {
            input = input.substr(2);
        }
        console.log("fixHex", input);
        return input;
    };

    var toString16 = function (input) {
        if (input == null || input.toString() === "") {
            return "";
        } else if (parseInt(input.toString()).toString() === "NaN") {
            return "NaN";
        } else {
            var output = parseInt(input.toString()).toString(16);
            if (output.length % 2 === 1) {
                output = "0" + output;
            }
            return output;
        }
    };

    var fromString16 = function (input) {
        if (input == null) {
            return null;
        } else {
            return parseInt(input.toString(), 16);
        }
    };

    var binary = function (input) {
        if (input == null || input.toString() === '') {
            return '';
        } else if (input.toString() === 'NaN' || parseInt(input.toString()).toString() === 'NaN') {
            return 'NaN';
        } else {
            var output = parseInt(input.toString()).toString(2);
            while (output.length % 8 !== 0) {
                output = "0" + output;
            }
            var formattedOutput = "";
            for (var i = 0; i < output.length; i += 4) {
                formattedOutput = formattedOutput + " " + output.substr(i, 4);
            }
            return formattedOutput;
        }
    };

    var toString2From16 = function (input) {
        if (input == null || input.toString() === '') {
            return '';
        } else {
            input = fixHex(input);
            var output = "";
            for (var i=0; i<input.length; i+=2) {
                var b = input.substr(i, 2);
                output = output + binary(fromString16(b));
            }
            return output;
        }
    };

    var toString10From16 = function (input) {
        if (input == null || input.toString() === '') {
            return '';
        } else {
            return parseInt(input, 16).toString();
        }
    };

    var sumOfDigits = function (input) {
        var sum = 0;
        for (var i=0; i<input.length; i++) {
            sum = sum + parseInt(input.charAt(i), 16);
        }
        while (sum >= 16) {
            var str = sum.toString(16);
            var ns = 0;
            for (var j = 0; j < str.length; j++) {
                ns += parseInt(str.charAt(j), 16);
            }
            sum = ns;
        }
        return sum;
    };

    var repetitiveXor = function (input) {
        input = fixHex(input.toString());
        var o = 0x5c;
        for (var i=0; i<input.length; i++) {
            o = o ^ parseInt(input.charAt(i), 16);
        }
        return o;
    };


    app.factory('helperMethods', function () {
        return {
            binary: function (input) {
                if (input == null || input.toString() === '') {
                    return '';
                } else if (input.toString() === 'NaN' || parseInt(input.toString()).toString() === 'NaN') {
                    return 'NaN';
                } else {
                    var output = parseInt(input.toString()).toString(2);
                    var formattedOutput = "";
                    for (var i = 0; i < output.length; i += 4) {
                        formattedOutput = formattedOutput + " " + output.substr(i, 4);
                    }
                    return formattedOutput;
                }
            }
        };
    });

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "main.html"
            })
            .when("/xor", {
                templateUrl: "xor.html"
            })
            .when("/hash", {
                templateUrl: "hash.html"
            })
            .when("/symmetric-keys", {
                templateUrl: "symmetric-keys.html"
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

    app.controller("navigationController", function ($scope, $location, helperMethods) {
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
        $scope.setActive = function (menuItem) {
            $scope.activeMenu = menuItem.value;
        };
        $scope.href = function (menuItem) {
            return '#!' + menuItem.value;
        };
        $scope.start = function () {
            $location.path("xor");
            $scope.activeMenu = "xor";
        };
        $scope.setActiveMenuByName = function (menuItem) {
            for (var i = 0; i < $scope.menuItems.length; i++) {
                var activeMenuItem = $scope.menuItems[i];
                if (activeMenuItem.value === menuItem) {
                    $scope.activeMenu = menuItem.value;
                    break;
                }
            }
        };
    });


    app.controller("xorController", function ($scope) {
        $scope.a = random16(256);
        $scope.b = random16(256);
        $scope.output = "";
        $scope.binary16 = toString2From16;
        $scope.fixHex = fixHex;
        $scope.xor = function () {
            $scope.output = toString16(fromString16($scope.a) ^ fromString16($scope.b));
        };
    });


    app.controller("symmetricKeyController", function ($scope) {
        $scope.iv = random16(256);
        $scope.input = random16(256);
        $scope.keyToEncrypt = random16(256);
        $scope.encrypted = "";

        $scope.cipher = "";
        $scope.keyToDecrypt = $scope.keyToEncrypt;
        $scope.decrypted = "";

        $scope.binary16 = toString2From16;

        $scope.encrypt = function () {
            var input = $scope.iv + "" + $scope.input;
            var key = fromString16($scope.keyToEncrypt);
            var prev = 0;
            var output = "";
            for (var i=0; i<input.length; i+=2) {
                var b = input.substr(i, 2);
                prev = (prev ^ fromString16(b)) ^ key;
                output = output + toString16(prev);
            }
            $scope.encrypted = output;
            $scope.cipher = output;
        };
        $scope.decrypt = function () {
            var input = $scope.cipher;
            var key = fromString16($scope.keyToDecrypt);
            var prev = 0;
            var output = "";
            for (var i=0; i<input.length; i+=2) {
                var b = input.substr(i, 2);
                var o = (key ^ fromString16(b)) ^ prev;
                prev = fromString16(b);
                output = output + toString16(o);
            }
            $scope.decrypted = output.substr(0, 2) + ", " + output.substr(2);
        };
    });


    app.controller("hashController", function ($scope) {
        $scope.input = random16(256);
        $scope.hashfun = "sumOfDigits";
        $scope.output = "";
        $scope.binary16 = toString2From16;
        $scope.dec16 = toString10From16;
        $scope.hash = function () {
            var input = fromString16($scope.input);
            if ($scope.hashfun === "sumOfDigits") {
                $scope.output = sumOfDigits($scope.input);
            } else if ($scope.hashfun === "repetitiveXor") {
                $scope.output = toString16(repetitiveXor(input));
            } else {
                $scope.output = hex_md5(input.toString());
            }
        };
    });

    app.controller("hmacController", function ($scope, helperMethods) {
        $scope.input = random(100);
        $scope.key = random(100);
        $scope.output = "";
        $scope.hashfun = "sumOfDigits";
        $scope.binary = helperMethods.binary;
        $scope.hmac = function () {
            if ($scope.hashfun === "sumOfDigits") {
                $scope.output = sumOfDigits($scope.key + "" + sumOfDigits($scope.key + "" + $scope.input));
            } else {
                $scope.output = hex_md5($scope.key + "" + hex_md5($scope.key + "" + $scope.input));
            }
        };
    });


    app.controller("keyExchangeController", function ($scope, helperMethods) {
        $scope.a = 4;
        $scope.b = 3;
        $scope.p = 23;
        $scope.g = 5;
        $scope.binary = helperMethods.binary;

        $scope.gPowerXmodP = function (y) {
            return Math.floor(Math.pow($scope.g, y)) % $scope.p;
        };

        $scope.xPowerYmodP = function (x, y) {
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
        $scope.binary = helperMethods.binary;

        $scope.publicKey = function (a, b, a1, b1) {
            var M = (a * b) - 1;
            var e = (a1 * M) + a;
            var d = (b1 * M) + b;
            var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
            return "(" + n + ", " + e + ")";
        };
        $scope.privateKey = function (a, b, a1, b1) {
            var M = (a * b) - 1;
            var e = (a1 * M) + a;
            var d = (b1 * M) + b;
            var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
            return d;
        };
        $scope.encrypt = function (a, b, a1, b1) {
            var M = (a * b) - 1;
            var e = (a1 * M) + a;
            var d = (b1 * M) + b;
            var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
            $scope.output = ($scope.input * e) % n;
        };
        $scope.decrypt = function (a, b, a1, b1) {
            var M = (a * b) - 1;
            var e = (a1 * M) + a;
            var d = (b1 * M) + b;
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
        $scope.binary = helperMethods.binary;

        $scope.publicKey = function (a, b, a1, b1) {
            var M = (a * b) - 1;
            var e = (a1 * M) + a;
            var d = (b1 * M) + b;
            var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
            return "(" + n + ", " + e + ")";
        };
        $scope.privateKey = function (a, b, a1, b1) {
            var M = (a * b) - 1;
            var e = (a1 * M) + a;
            var d = (b1 * M) + b;
            var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
            return d;
        };
        $scope.encrypt = function (a, b, a1, b1, p) {
            var M = (a * b) - 1;
            var e = (a1 * M) + a;
            var d = (b1 * M) + b;
            var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
            return (p * e) % n;
        };
        $scope.decrypt = function (a, b, a1, b1, c) {
            var M = (a * b) - 1;
            var e = (a1 * M) + a;
            var d = (b1 * M) + b;
            var n = (a1 * b1 * M) + (a * b1) + (a1 * b) + 1;
            return (c * d) % n;
        };
        $scope.sign = function () {
            $scope.signatureOutput = "sig-out";
            $scope.signatureInput = "sig-out";
        };
        $scope.verify = function () {
            $scope.output = "false";
        };

    });


})();
