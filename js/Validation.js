export default class Validation {

    /**
     * @constructs
     */
    constructor()
    {
        this.url = 'http://localhost:3000/api/teddies/order';
        this.form = document.getElementById('form');
        this.contact = this.getValue();
        this.products = this.getProducts();
    }

    /**
     * Permet de poster les donnée à l'API
     * @async
     * @param url
     * @param contact
     * @param products
     * @return {Promise<any>}
     */
    async post(url, contact, products)
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                contact: contact,
                products: products
            })
        });
        return response.json();
    }

    /**
     * Ecoute l'envoi du formulaire et redirige vers la page de confirmation
     */
    getValue()
    {
        const {firstname, lastname, address, city, email} = this.form;
        // Démarre l'écoute lors du click sur envoyer
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            // Si le formulaire n'est pas valide on strop tout
            if (!this.validate()) return;

            this.contact = {
                firstName: firstname.value.trim(),
                lastName: lastname.value.trim(),
                address: address.value.trim(),
                city: city.value.trim(),
                email: email.value.trim()
            };
            // Permet de savoir dans quel API ce trouve le produit
            let api = Object.keys(this.products);
            const results = [];
            // On boucle sur chaque api pour avoir la bonne URL
            api.forEach(url => {
                let orderUrl = 'http://localhost:3000/api/' + url + '/order';
                if (this.products[url].length > 0) {
                    // On post la commande pour chaque API sélectionné
                    this.post(orderUrl, this.contact, this.products[url])
                        .then(response => {
                            // En cas de succès on remplis le tableau avec la réponse de l'API
                            results.push(response);
                        })
                        .catch(error => {
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
            });
            // On crée un promesse avec le tableau de réponse de l'API
            new Promise((resolve, reject) => {
                // On met un timer le temps de résoudre
                window.setTimeout(() => {
                    resolve(results)
                }, 500)
            })
                .then(result => {
                    // On supprimer le panier
                    localStorage.removeItem('cart');
                    // On crée un Storage pour la page de confirmation
                    localStorage.setItem('orderValidation', JSON.stringify(result));
                    // On redirige l'utilisateur
                    location.href = './confirmation.html';
                })
                .catch(error => {
                    const alert = document.getElementById('products');
                    alert.innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <p>Une erreur est survenue : ${error}</p>
                            <p>Si le problème persiste, veuillez nous contacter</p>
                        </div>
                    `;
                    console.error(error)
                })
        });
    }

    /**
     * Vérifie les éléments ud panier pour définir dans quel API il se situe
     * @return {{cameras: Array, furniture: Array, teddies: Array}} products
     */
    getProducts()
    {
        const cart = JSON.parse(localStorage.getItem('cart'));
        let products = {
            'teddies': [],
            'cameras': [],
            'furniture': [],
        };
        cart.cart.forEach(product => {
            Object.keys(product).find(element => {
                switch (element) {
                    case 'colors':
                        products.teddies.push(product._id);
                        break;
                    case 'lenses':
                        products.cameras.push(product._id);
                        break;
                    case 'varnish':
                        products.furniture.push(product._id);
                        break;
                }
            });
        });
        return products;
    }

    /**
     * Verifie les données entrée par l'utilisateur
     * @return {boolean}
     */
    validate()
    {
        const {firstname, lastname, address, city, email} = this.form;


        const regExText = /^[a-zA-Z ]+$/;
        const regExAddress = /^[a-zA-Z0-9\s,'-]*$/;
        const regExCity = /^[a-zA-Z]+(?:[\s,'-][a-zA-Z]+)*$/;
        const regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regExText.test(firstname.value.trim())) {
            this.isInvalid(firstname, "Prénom invalide");
            return false;
        }
        if (!regExText.test(lastname.value.trim())) {
            this.isInvalid(lastname, "Nom invalide");
            return false;
        }
        if (!regExAddress.test(address.value.trim())) {
            this.isInvalid(address, "Adresse invalide");
            return false;
        }
        if (!regExCity.test(city.value.trim())) {
            this.isInvalid(city, "Ville invalide");
            return false;
        }
        if (!regExEmail.test(email.value.trim())) {
            this.isInvalid(email, "Email invalide");
            return false;
        }
        return true;
    }

    /**
     * Affiche en HTML les erreurs du formulaire
     * @param {Object} element
     * @param {string} text
     */
    isInvalid(element, text)
    {
        const invalid = document.createElement('div');
        element.classList.add('is-invalid');
        invalid.classList.add('invalid-feedback');
        invalid.innerText = text;
        element.insertAdjacentElement('afterend', invalid);
    }

}
