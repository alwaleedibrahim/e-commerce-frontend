
function fetchProducts(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'products.json', true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const products = JSON.parse(xhr.responseText);
            callback(null, products);
        } else {
            callback(new Error('Failed to fetch products'), null);
        }
    };
    xhr.onerror = function() {
        callback(new Error('Network error'), null);
    };
    xhr.send();
}


function initializeFavorites() {
    const favoritesList = document.getElementById('favorites-list');

    favoritesList.innerHTML = '';

    fetchProducts(function(error, products) {
        if (error) {
            console.error('Error fetching products:', error);
            return;
        }

      
        products.forEach(product => {
            if (product.favorite) {
                const card = createProductCard(product);
                favoritesList.appendChild(card);
            }
        });
    });
}


function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('card');

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('imagesi-div');

    const mainImg = document.createElement('img');
    mainImg.src = product.image;
    mainImg.alt = product.name;
    mainImg.classList.add('images');

    imgDiv.appendChild(mainImg);
    card.appendChild(imgDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title-card');
    titleDiv.textContent = product.name;

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('price-div');

    const price = document.createElement('span');
    price.textContent = `$${product.price}`;

    priceDiv.appendChild(price);
    card.appendChild(titleDiv);
    card.appendChild(priceDiv);

    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fa-heart', 'heart-icon', product.favorite ? 'fa-solid' : 'fa-regular');
    heartIcon.dataset.productId = product.id;
    card.appendChild(heartIcon);

    return card;
}

// Function to toggle product favorite status
function toggleFavorite(productId) {
    fetchProducts(function(error, products) {
        if (error) {
            console.error('Error fetching products:', error);
            return;
        }

        const product = products.find(p => p.id === productId);
        if (product) {
            product.favorite = !product.favorite;
            saveProducts(products);

            updateFavoritesCount();
            initializeFavorites(); 
        } else {
            console.error('Product not found');
        }
    });
}

// Function to save products to local storage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Function to update favorites count in header
function updateFavoritesCount() {
    fetchProducts(function(error, products) {
        if (error) {
            console.error('Error fetching products:', error);
            return;
        }

        const favoritesCount = document.getElementById('favorites-count');
        const count = products.filter(p => p.favorite).length;
        favoritesCount.textContent = count;
    });
}


document.addEventListener('click', function(e) {
    if (e.target.classList.contains('heart-icon')) {
        const productId = parseInt(e.target.dataset.productId);
        toggleFavorite(productId);

     
        e.target.classList.toggle('fa-regular');
        e.target.classList.toggle('fa-solid');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    initializeFavorites();
    updateFavoritesCount();
});