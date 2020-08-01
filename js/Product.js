import Cart from './Cart.js';

export default class Product
{

    constructor ()
    {
        const apiTeddies = "http://localhost:3000/api/teddies";

        this.element = document.getElementById('products');
        if (window.location.pathname === '/product.html') {
            const server = "http://localhost:3000/api/";
            this.url = server + Product.getUrlParams('api') + '/' + Product.getUrlParams('id');
        } else {
            this.url = apiTeddies;
        }
        this.price = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR"
        });
        this.CART = new Cart();
    }

    setUrl (url)
    {
        this.url = url;
    }

    /*
        Récupère les produits en format JSON
     */
    async getProduct ()
    {
        const response = await fetch(this.url);
        return response.json();
    }

    /*
        Retourne les paramètre d'une URL
     */
    static getUrlParams (params, uri = null)
    {
        let url;
        if (uri !== null) {
            url = new URL(uri);
            return url.pathname.substring(5);
        } else {
            url = new URL(window.location.href);
        }
        const search = new URLSearchParams(url.search);
        if (search.has(params)) {
            return search.get(params);
        }
    }

    /*
        Crée la liste des produits en fonction de l'URL
     */
    createProduct ()
    {
        this.getProduct().then( data => {
            if (Array.isArray(data)) {
                data.forEach(product => {
                    this.element.insertBefore(this.productList(product), null);
                });
            } else {
                this.element.insertBefore(this.productList(data, true), null);
            }
            this.CART.listenAddProduct();
            this.CART.listenDeleteProduct();
            this.CART.checkDeleteButton();
        })
            .catch(error =>  {
                const alert = document.getElementById('products');
                alert.innerHTML = `
                                <div class="alert alert-danger" role="alert">
                                    <p>Une erreur est survenue : ${error}</p>
                                    <p>Si le problème persiste, veuillez nous contacter</p>
                                </div>
                            `;
                console.error(error)
            });
        // TODO: Gérer un affichage utilisateur
    }


    static getSpecifier (product, api)
    {
        let spec;
        let html = "";
        switch (api) {
            case 'teddies':
                spec = product.colors;
                break;
            case 'cameras':
                spec = product.lenses;
                break;
            case 'furniture':
                spec = product.varnish;
                break;
        }
        spec.forEach(s => {
           html += `<option value="${s}">${s}</option>`
        });
        return html;
    }
    /*
        Renvoie le code HTML de la liste des produits ou d'un produit pour la page product.html
        lorsque one = true
     */
    productList (product, one = false)
    {
        let div = document.createElement('div');
        if (one) {
            div.classList.add('col', 'mb-4');
            div.innerHTML +=`
                <article class="card h-100">
                    <img class="card-img-top" src="${product.imageUrl}" alt="${product.name}">
                    <div class="card-body text-center">
                        <h3 class="card-title">
                           ${product.name} 
                        </h3>
                        <h4>${this.price.format(product.price)}</h4>
                        <p class="card-text">${product.description}</p>
                        <label for="specifier">
                            Disponibilité :
                            <select name="specifier" id="specifier"  class="custom-select">
                                ${Product.getSpecifier(product, Product.getUrlParams('api'))}
                            </select>
                        </label>
                    </div>
                    <footer class="card-footer text-center" id="btnCart">
                        <button 
                        class="btn btn-outline-primary" 
                        id="addCart" 
                        data-api="${Product.getUrlParams('api')}" 
                        data-id="${product._id}">
                        Ajouter au panier
                        </button>
                        <button 
                        class="btn btn-outline-danger invisible" 
                        id="delCart" 
                        data-api="${Product.getUrlParams('api')}" 
                        data-id="${product._id}">
                            Retirer
                        </button>
                    </footer>
                </article>
            `;
        } else {
            div.classList.add('col-lg-4', 'col-md-6', 'mb-4');
            div.innerHTML +=`
                <article class="card h-100">
                    <a href="#">
                        <img class="card-img-top" src="${product.imageUrl}" alt="${product.name}">
                    </a>
                    <div class="card-body">
                        <h4 class="card-title">
                            <a href="./product.html?api=${this.url.substr(26)}&id=${product._id}">${product.name}</a>
                        </h4>
                        <h5>${this.price.format(product.price)}</h5>
                        <p class="card-text">${product.description}</p>
                    </div>
                    <footer class="card-footer" id="btnCart" data-id="${product._id}">
                        <button 
                        class="btn btn-outline-primary" 
                        id="addCart" 
                        data-api="${Product.getUrlParams('api', this.url)}" 
                        data-id="${product._id}">
                            Acheter
                        </button>
                        <button 
                        class="btn btn-outline-danger invisible" 
                        id="delCart" 
                        data-api="${Product.getUrlParams('api', this.url)}" 
                        data-id="${product._id}">
                            Retirer
                        </button>
                    </footer>
                </article>
            `;
        }
        return div;
    }

    /*
        Supprime le code HTML de la liste des produits ou le produit afficher
     */
    removeProduct()
    {
        this.element.innerHTML = '';
    }

    getCart()
    {
        return this.CART.getCart();
    }
}