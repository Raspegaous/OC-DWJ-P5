import Product from './Product.js';

const api = document.querySelectorAll('#api');
let apiJson = 'teddies';

const PRODUCT = new Product();



if (window.location.pathname === '/cart.html') {
    PRODUCT.getCart();
} else {
    PRODUCT.createProduct();
}

api.forEach(value => {
    value.addEventListener('click', e => {
        e.preventDefault();
        apiJson = e.originalTarget.dataset.api;
        PRODUCT.setUrl('http://localhost:3000/api/' + apiJson);
        PRODUCT.removeProduct();
        PRODUCT.createProduct();
    })
});
