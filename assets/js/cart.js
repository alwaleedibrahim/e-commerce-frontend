// Function to request products from a JSON file
function requestProducts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './../api/products.json');

    xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
            let products = JSON.parse(this.responseText);
            let productContainer = document.querySelector('.cart-items');
            let savedCart = JSON.parse(localStorage.getItem('cart')) || [];

            products.forEach(product => {
                let cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item', 'cart-row');

                cartItemElement.innerHTML = `
                    <img src="${product.image}">
                    <div class="cart-item-details">
                        <h4>${product.name}</h4>
                        <p>$${product.price}</p>
                        <input type="number" value="1" min="1" max="20">
                        <p class="subtotal">$${product.price}</p>
                        <button class="remove-item">Remove</button>
                    </div>`;

              
                productContainer.appendChild(cartItemElement);

                
                let quantityInput = cartItemElement.querySelector('input[type="number"]');
                quantityInput.addEventListener('change', function() {
                    updateSubtotal(cartItemElement, product);
                    updateCartTotal();
                });

                let removeButton = cartItemElement.querySelector('.remove-item');
                removeButton.addEventListener('click', function() {
                    cartItemElement.remove();
                    updateCartTotal();
                });

               
                let savedItem = savedCart.find(item => item.productName === product.name);
                if (savedItem) {
                    quantityInput.value = savedItem.quantity;
                    updateSubtotal(cartItemElement, product);
                }
            });

            updateCartTotal();
        } else {
            console.error('Failed to load products');
        }
    };

    xhr.send();
}

function updateSubtotal(cartItemElement, product) {
    let quantity = parseInt(cartItemElement.querySelector('input[type="number"]').value);
    let subtotal = quantity * product.price;
    cartItemElement.querySelector('.subtotal').innerText = `$${subtotal}`;

    saveCartToStorage();
}


function updateCartTotal() {
    let cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    cartItems.forEach(cartItem => {
        let subtotal = parseFloat(cartItem.querySelector('.subtotal').innerText.replace('$', ''));
        total += subtotal;
    });

    document.querySelector('.subtotal').innerText = `$${total.toFixed(2)}`;
    saveCartToStorage();
}

// save cart data to localStorage
function saveCartToStorage() {
    let cartItems = document.querySelectorAll('.cart-item');
    let cart = [];
    cartItems.forEach(cartItem => {
        let productName = cartItem.querySelector('h4').innerText;
        let price = parseFloat(cartItem.querySelector('.subtotal').innerText.replace('$', ''));
        let quantity = parseInt(cartItem.querySelector('input[type="number"]').value);
        cart.push({ productName, price, quantity });
    });

    localStorage.setItem('cart', JSON.stringify(cart));
}


document.addEventListener('DOMContentLoaded', function() {
    requestProducts();
});