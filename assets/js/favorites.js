document.addEventListener('DOMContentLoaded', function() {
    fetch('./../api/products.json')
        .then(response => response.json())
        .then(data => {
            let favorites = []; 

            // Check if favorites exist in localStorage
            if (localStorage.getItem('favorites')) {
                favorites = JSON.parse(localStorage.getItem('favorites'));
            } else {
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }

            const favoritesContainer = document.getElementById('favorites-container');
            favoritesContainer.innerHTML = '';

            data.forEach(product => {
                const card = createProductCard(product);

                // Check if product is in favorites array
                if (favorites.includes(product.id)) {
                    card.classList.add('favorite'); 
                }

              
                favoritesContainer.appendChild(card);

              
                const heartIcon = card.querySelector('.fa-heart');
                heartIcon.addEventListener('click', function() {
                    const productId = product.id;

                    if (favorites.includes(productId)) {
                       
                        favorites = favorites.filter(id => id !== productId);
                        card.classList.remove('favorite');
                    } else {
                        // Product is not a favorite, add it
                        favorites.push(productId);
                        card.classList.add('favorite');
                    }

                    // Update localStorage with new favorites array
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                });
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});

function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <div class="images-product-container">
            <img src="${product.image}" alt="${product.name}" class="product-img">
        </div>
        <div class="product-content-container">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="data-div">
                <span class="price">${product.price}</span>
                <button class="btn-orange">Add to Cart</button>
            </div>
            <i class="fa-regular fa-heart"></i> <!-- Heart icon for marking favorites -->
        </div>
    `;

    return card;
}
