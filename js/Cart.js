import Validation from "./Validation.js";

export default class Cart {

    constructor() {
        this.viewCart = document.getElementById('cart');
        if (localStorage.getItem('cart') === null) {
            localStorage.setItem('cart', JSON.stringify({
                'cart': []
            }));
        }
        this.products = JSON.parse(localStorage.getItem('cart'));
        if (this.products.cart.length > 0) {
            this.viewCart.innerText = this.products.cart.length.toString();
        }
        this.price = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR"
        });
    }

    add (api, id)
    {
        let product = this.getProduct(api, id);
        product.then(p => {
            this.products.cart.push(p);
            localStorage.setItem('cart', JSON.stringify(this.products));
            this.viewCart.innerText = this.products.cart.length.toString();
        }).catch(error => error);
        // TODO: Gérer un affichage utilisateur
        this.createDeleteButton(api, id);
    }

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
        localStorage.setItem('cart', JSON.stringify(this.products));
        if (this.products.cart.length === 0) {
            this.viewCart.innerText = null;
        } else {
            this.viewCart.innerText = this.products.cart.length.toString();
        }
        if (!this.products.cart.find(el => el._id === id)){
            this.removeDeleteButton(id);
        }
    }

    async getProduct(api, id)
    {
        const url = 'http://localhost:3000/api/' + api + '/' + id;
        const response = await fetch(url);
        return response.json();
    }

    checkDeleteButton ()
    {
        const btn = document.querySelectorAll('#delCart');
        btn.forEach(del => {
            const find = this.products.cart.find(el => el._id);
            if (find._id === del.dataset.id) {
                this.createDeleteButton(del.dataset.api, del.dataset.id);
            }
        });
    }

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

    getCart()
    {
        let data = [];
        this.products.cart.forEach(product => {
            data.push(product);
        });
        return this.viewerCart(data);
    }

    viewerCart(data) {
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
        getForm.addEventListener('click', e => {
            const form = document.getElementById('form');
            form.classList.remove('invisible');
            reset.classList.add('invisible');
            e.target.classList.add('invisible');
            new Validation();
        });
    }

    total(data) {
        let sum = 0;
        data.forEach(product => {
            sum += product.price;
        });
        return sum;
    }
}