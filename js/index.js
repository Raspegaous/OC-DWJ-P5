const url = "http://localhost:3000/api/cameras";

// Récupère la div dans laquelle les produits seront affichés
const products = document.getElementById('products');

// Permet de formater les chiffres en monétaire Euro
const price = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR"
});

// Récupère la liste des produits
const getProducts = async () => {
    const response = await fetch(url);
    return response.json();
};

getProducts()
    // succès de récupération du json
    .then(data => {
        data.forEach(product => {
            // on ajoute chaque produit à `#products`
            products.innerHTML +=`<div class="col-lg-4 col-md-6 mb-4">
                                    <article class="card h-100">
                                        <a href="#">
                                            <img class="card-img-top" src="${product.imageUrl}" alt="${product.name}">
                                        </a>
                                        <div class="card-body">
                                            <h4 class="card-title">
                                                <a href="./product.html?id=${product._id}">${product.name}</a>
                                            </h4>
                                            <h5>${price.format(product.price)}</h5>
                                            <p class="card-text">${product.description}</p>
                                        </div>
                                        <footer class="card-footer">
                                            <button class="btn btn-outline-primary">Ajouter</button>
                                        </footer>
                                    </article>
                                </div>`
        });
    })
    // Erreur de récupération du json
    .catch(error => console.error(error));