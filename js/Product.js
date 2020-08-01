import Cart from './Cart.js';

export default class Product
{

    /**
     * @constructs
     */
    constructor ()
    {
        // url par défaut
        const apiTeddies = "http://localhost:3000/api/teddies";
        // Sélectionne l'id du DOM pour insérer le code HTML
        this.element = document.getElementById('products');
        // Condition pour définir l'url de l'api
        if (window.location.pathname === '/product.html') {
            const server = "http://localhost:3000/api/";
            this.url = server + Product.getUrlParams('api') + '/' + Product.getUrlParams('id');
        } else {
            this.url = apiTeddies;
        }
        // Modifie un nombre en chiffre monétaire
        this.price = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR"
        });
        // Crée un nouveau panier
        this.CART = new Cart();
    }

    /**
     * Permet de modifier l'url de connection à l'API
     * @param {string} url
     **/
    setUrl (url)
    {
        this.url = url;
    }

    /**
     *  Récupère les produits en format JSON
     *
     * @async   Fonction asynchrone
     * @return {Promise<any>}
     **/
    async getProduct ()
    {
        const response = await fetch(this.url);
        return response.json();
    }

    /**
     * Retourne les paramètre d'une URL
     *
     * @param {string} [params]
     * @param {(null|string)} [uri = null]
     *
     * @return string
     **/
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

    /**
     * Crée la liste des produits en fonction de l'URL
     *
     * @callback Affiche la liste des produits ou le produit en page product.html
     */
    createProduct ()
    {
        this.getProduct().then( data => {
            // si `data` est un tableau il s'agit alors d'une liste de produit
            if (Array.isArray(data)) {
                data.forEach(product => {
                    this.element.insertBefore(this.productList(product), null);
                });
            // si `data` n'est pas un tableau il s'agit d'un seul produit
            } else {
                this.element.insertBefore(this.productList(data, true), null);
            }
            // On initialise le panier en écoutant les boutons ajouter, supprimer
            this.CART.listenAddProduct();
            this.CART.listenDeleteProduct();
            this.CART.checkDeleteButton();
        })
            // en cas d'érreur on affiche au navigateur et en console
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
    }

    /**
     * Permet de créer la liste déroulante de chaque produit en fonction de sa spécialité
     *
     * @static
     * @param {Object}  product
     * @param {string}  api
     * @return {string} Renvoi le code html
     */
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

    /**
     * Renvoie le code HTML de la liste des produits ou d'un produit pour la page product.html
     * @param {Object}          product
     * @param {boolean}         [one = false]   Si il vaut true alors il s'agit de l'affichage d'un seul produit
     * @return {HTMLDivElement}
     */
    productList (product, one = false)
    {
        // On crée un div
        let div = document.createElement('div');
        // Code HTML pour un produit
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
        // Code HTML pour une liste de produit
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

    /**
     * Supprime le code HTML de la liste des produits ou le produit afficher
     */
    removeProduct()
    {
        this.element.innerHTML = '';
    }

    /**
     * Création du Panier
     * @return {*}
     */
    getCart()
    {
        return this.CART.getCart();
    }
}
