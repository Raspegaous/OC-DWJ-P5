const Product = require('../js/Product.js');
require('../js/Cart.js');
require('../js/Validation.js');
const assert = require('assert');

describe('Product', function () {

    it('should do products list', function () {
        const products = new Product();
        assert.equal(products.getProduct(), jsonSchema);

    })
});