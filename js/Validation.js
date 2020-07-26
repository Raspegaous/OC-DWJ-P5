export default class Validation
{

    constructor ()
    {
        this.url = 'http://localhost:3000/api/teddies/order';
        this.form = document.getElementById('form');
        this.contact = this.getValue();
        this.products = this.getProducts();
    }

    async post (url, contact, products)
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

    getValue()
    {
        const { firstname, lastname, address, city, email } = this.form;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            if (!this.validate()) return;
            this.contact = {
                    firstName: firstname.value.trim(),
                    lastName: lastname.value.trim(),
                    address: address.value.trim(),
                    city: city.value.trim(),
                    email: email.value.trim()
            };

            let api = Object.keys(this.products);
            const results = [];
            api.forEach(url => {
                let orderUrl = 'http://localhost:3000/api/' + url + '/order';
                if (this.products[url].length > 0) {
                    this.post(orderUrl, this.contact, this.products[url])
                        .then(response => {
                            results.push(response);
                        })
                        .catch(error => console.error(error));
                    //TODO: Prévoir affichage utilisateur
                }
            });
            new Promise((resolve) => {
                resolve(results);
            }).then((result) => {
                localStorage.removeItem('cart');
                localStorage.setItem('order', JSON.stringify(result));
                // console.log(result);
                // console.log(JSON.parse(localStorage.getItem('orderValidation')));
                window.location.href = './confirmation.html';

            });
        });
    }

    getProducts() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        let products = {
            'teddies' : [],
            'cameras' : [],
            'furniture' : [],
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

    validate() {
        const { firstname, lastname, address, city, email } = this.form;

        const regExText = /^[a-zA-Z ]+$/;
        const regExAddress = /^[a-zA-Z0-9\s,'-]*$/;
        const regExCity = /^[a-zA-Z]+(?:[\s,'-][a-zA-Z]+)*$/;
        const regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regExText.test(firstname.value.trim())) { firstname.classList.add('is-invalid'); return false; }
        if (!regExText.test(lastname.value.trim())) { lastname.classList.add('is-invalid'); return false; }
        if (!regExAddress.test(address.value.trim())) { address.classList.add('is-invalid'); return false; }
        if (!regExCity.test(city.value.trim())) { city.classList.add('is-invalid'); return false; }
        if (!regExEmail.test(email.value.trim())) { email.classList.add('is-invalid'); return false; }

        return true;
    }
}