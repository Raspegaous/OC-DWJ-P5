import Validation from './Validation.js';

export default class Cart {

    /**
     * A la création du panier on vérifie si il existe
     * @constructs
     */
    constructor()
    {
        this.viewCart = document.getElementById('cart');
        // On crée un Storage si inexistant pour stocké les données du panier
        if (localStorage.getItem('cart') === null) {
            localStorage.setItem('cart', JSON.stringify({
                'cart': []
            }));
        }
        this.products = JSON.parse(localStorage.getItem('cart'));
        // Permet l'affichage du nombre de produit dans le panier dans la navbar
        if (this.products.cart.length > 0) {
            this.viewCart.innerText = this.products.cart.length.toString();
        }

        this.price = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR"
        });
    }

    /**
     * Ajoute un produit dans le panier
     * @param {string} api
     * @param {number} id
     */
    add (api, id)
    {
        // On récupère les produits en fonction de l'API et de l'ID
        let product = this.getProduct(api, id);
        // En cas de résultats on modifie le storage pour en registrer les données
        product.then(p => {
            this.products.cart.push(p);
            localStorage.setItem('cart', JSON.stringify(this.products));
            this.viewCart.innerText = this.products.cart.length.toString();
        })
            // En cas d'échec on affiche en HTML et en console
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
        // On crée le bouton supprimer
        this.createDeleteButton(api, id);
    }

    /**
     * Supprimer un produit du panier
     * @param {string} api
     * @param {number} id
     */
    delete (api, id)
    {
        // Supprime l'élément du tableau
        this.products.cart.splice(
            // Cherche l'index de l'élément dans le tableau
            this.products.cart.indexOf(
                // Cherche si l'élément est dans le tableau et retourne l'élément
                this.products.cart.find(el => el._id === id)
            ), 1
        );
        // Modifie le panier
        localStorage.setItem('cart', JSON.stringify(this.products));
        // Vérifie la quantité pour l'afficahge dans la navbar
        if (this.products.cart.length === 0) {
            this.viewCart.innerText = null;
        } else {
            this.viewCart.innerText = this.products.cart.length.toString();
        }
        // Permet d'enlever le bouton supprimer si plus de produit dans le panier
        if (!this.products.cart.find(el => el._id === id)){
            this.removeDeleteButton(id);
        }
    }

    /**
     * Récupère un produit sur l'API
     * @async
     * @param {string} api
     * @param {string} id
     * @return {Promise<any>}
     */
    async getProduct(api, id)
    {
        const url = 'http://localhost:3000/api/' + api + '/' + id;
        const response = await fetch(url);
        return response.json();
    }

    /**
     * Vérifie si le bouton supprimer doit être affiché
     */
    checkDeleteButton ()
    {
        const btn = document.querySelectorAll('#delCart');
        btn.forEach(del => {
            const find = this.products.cart.find(el => el._id);
            if (find && find._id === del.dataset.id) {
                this.createDeleteButton(del.dataset.api, del.dataset.id);
            }
        });
    }

    /**
     * Affiche le bouton supprimer
     * @param {string} api
     * @param {string} id
     */
    createDeleteButton(api, id)
    {
        const btn = document.querySelectorAll('#delCart');
        btn.forEach(button => {
            if (button.dataset.id === id) {
                button.classList.add('visible');
                button.classList.remove('invisible');
            }
        });
    }

    /**
     * Supprimer le bouton supprimer
     * @param {string} id
     */
    removeDeleteButton(id)
    {
        const btn = document.querySelectorAll('#delCart');
        btn.forEach(button => {
            if (button.dataset.id === id) {
                button.classList.remove('visible');
                button.classList.add('invisible');
            }
        });
    }

    /**
     * Ecoute le click du bouton ajouter
     */
    listenAddProduct ()
    {
        const addCart = document.querySelectorAll('#addCart');
        addCart.forEach(add => {
            add.addEventListener('click', e => {
                e.preventDefault();
                let api = e.originalTarget.dataset.api;
                let id = e.originalTarget.dataset.id;
                this.add(api, id);
            })
        })
    }

    /**
     * Ecoute le ckick du bouton supprime
     */
    listenDeleteProduct()
    {
        const delCart = document.querySelectorAll('#delCart');
        delCart.forEach(del => {
            del.addEventListener('click', e => {
                e.preventDefault();
                let api = e.originalTarget.dataset.api;
                let id = e.originalTarget.dataset.id;
                this.delete(api, id);
          });
        });
    }

    /**
     * Stock dans un tableau les éléments du panier et l'envoi a la fonction viewverCart
     * @return void
     */
    getCart()
    {
        let data = [];
        this.products.cart.forEach(product => {
            data.push(product);
        });
        return this.viewerCart(data);
    }

    /**
     * Affiche en HTML les éléments présents dans le panier
     * @param {[data]}  data
     */
    viewerCart(data)
    {
        const table = document.getElementById('cartTable');
        const getForm = document.getElementById('getForm');
        const reset = document.getElementById('reset');
        data.forEach(product => {
            table.innerHTML += `
                <tr class="d-flex align-items-center justify-content-between">
                    <td class="w-25">
                        <img src="${product.imageUrl}" class="img-responsive" alt="${product.name}" width="100%">
                    </td>
                    <td>${product.name}</td>
                    <td>${this.price.format(product.price)}</td>
                </tr>            
            `;
        });

        table.innerHTML += `
                <tr class="table-info d-flex align-items-center justify-content-around">
                    <th colspan="2">Total</th>
                    <th>${this.price.format(this.total(data))}</th>
                </tr>
            </table>
        `;
        // Crée un événement pour afficher le formulaire
        getForm.addEventListener('click', e => {
            const form = document.getElementById('form');
            form.classList.remove('invisible');
            reset.classList.add('invisible');
            e.target.classList.add('invisible');
            // Démarre la class Validation pour le formulaire
            new Validation();
        });
    }

    /**
     * Renvoie la somme total des produits présent dans le panier
     * @param {[Object]}    data
     * @return {number}
     */
    total(data)
    {
        let sum = 0;
        data.forEach(product => {
            sum += product.price;
        });
        return sum;
    }
}
