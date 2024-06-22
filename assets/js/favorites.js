// Define the favorites array to store favorite products
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to add or remove products from favorites
function toggleFavorite(product) {
    const index = favorites.findIndex(fav => fav.id === product.id);
    if (index === -1) {
        favorites.push(product);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

// Function to render the favorite products
function renderFavorites() {
    const favoriteProductsDiv = document.getElementById('favorite-products');
    favoriteProductsDiv.innerHTML = '';
    card(favorites, favoriteProductsDiv);
}

// Event listener for the favorite icon click
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('hover-icon')) {
        const productId = event.target.dataset.productId;
        const product = favorites.find(prod => prod.id === productId);
        toggleFavorite(product);
        event.target.classList.toggle('favorite');
    }
});

// Function to mark products as favorite on load
function markFavorites() {
    document.querySelectorAll('.hover-icon').forEach(icon => {
        const productId = icon.dataset.productId;
        if (favorites.some(fav => fav.id === productId)) {
            icon.classList.add('favorite');
        }
    });
}

// Call markFavorites on page load to reflect favorite status
window.onload = function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './../api/products.json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            data = JSON.parse(xhr.responseText);
            markFavorites();
            if (location.pathname.includes('/pages/favorites.html')) {
                renderFavorites();
            }
        }
    };
    xhr.send();
};

// CSS to style the favorite icon
const style = document.createElement('style');
style.innerHTML = `
    .favorite {
        color: red;
    }
`;
document.head.appendChild(style);