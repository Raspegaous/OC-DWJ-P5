const products = document.getElementById('products');
const validation = JSON.parse(localStorage.getItem('orderValidation'));

let firstName, lastName, orderId;


validation.forEach(v => {
   firstName = v.contact.firstName;
   lastName = v.contact.lastName;
   orderId = v.orderId;
});

products.innerHTML += `
            <div class="jumbotron">
                <h2 class="display-4">Commande confirmé</h2>
                <p class="lead">Votre commande à bien été validé.</p>
                <p class="lead">Nous vous remercions de votre achat ${firstName + ' ' + lastName}</p>
                <p class="lead">Commande N°${orderId}</p>
            </div>
`;

localStorage.clear();