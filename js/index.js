import Product from './Product.js';

// Sélectionne les items de la navbar
const api = document.querySelectorAll('#api');
// Défini une api par défaut
let apiJson = 'teddies';


const PRODUCT = new Product();

// Si la page affiché est le panier alors on lance la fonction pour récupérer les produits sélectionnés
// Sinon on affiche les produits
if (window.location.pathname === '/cart.html') {
    PRODUCT.getCart();
} else {
    PRODUCT.createProduct();
}

// On écoute le click sur les items de la navbar afin de modifier les produits
api.forEach(value => {
    value.addEventListener('click', e => {
        e.preventDefault();
        apiJson = e.originalTarget.dataset.api;
        PRODUCT.setUrl('http://localhost:3000/api/' + apiJson);
        PRODUCT.removeProduct();
        PRODUCT.createProduct();
    })
});
