"use strict";
var BalletFlat = /** @class */ (function () {
    function BalletFlat() {
        this.purpose = 'dancing';
    }
    return BalletFlat;
}());
var Boot = /** @class */ (function () {
    function Boot() {
        this.purpose = 'woodcutting';
    }
    return Boot;
}());
var Sneaker = /** @class */ (function () {
    function Sneaker() {
        this.purpose = 'walking';
    }
    return Sneaker;
}());
var Shoe = {
    create: function (type) {
        switch (type) {
            case 'balletFlat':
                return new BalletFlat;
            case 'boot':
                return new Boot;
            case 'sneaker':
                return new Sneaker;
        }
    }
};
console.log(Shoe.create('boot'));
//# sourceMappingURL=03.js.map