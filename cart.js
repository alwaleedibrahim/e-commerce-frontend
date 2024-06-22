// Function to request products from a JSON file
function requestProducts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'products.json');

    xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
            let productsData = JSON.parse(this.responseText);
            let productContainer = document.querySelector('.cart-items');
            let savedCart = JSON.parse(localStorage.getItem('cart')) || [];

            for (let category in productsData) {
                let categoryArray = productsData[category];
                
                for (let i = 0; i < categoryArray.length; i++) {
                    let product = categoryArray[i];
                    let savedItem = savedCart.find(item => item.productName === product.name);

                    if (savedItem) {
                        let cartItemElement = document.createElement('div');
                        cartItemElement.classList.add('cart-item', 'cart-row');

                        cartItemElement.innerHTML = `
                            <img src="${product.image_key}">
                            <div class="cart-item-details">
                                <h4>${product.name}</h4>
                                <p>$${product.price}</p>
                                <input type="number" value="${savedItem.quantity}" min="1" max="20">
                                <p class="subtotal">$${(savedItem.quantity * product.price).toFixed(2)}</p>
                                <button class="remove-item">Remove</button>
                            </div>`;

                        productContainer.appendChild(cartItemElement);

                        let quantityInput = cartItemElement.querySelector('input[type="number"]');
                        quantityInput.addEventListener('change', function() {
                            updateSubtotal(cartItemElement, product, quantityInput.value);
                            updateCartTotal();
                        });

                        let removeButton = cartItemElement.querySelector('.remove-item');
                        removeButton.addEventListener('click', function() {
                            cartItemElement.remove();
                            updateCartTotal();
                        });
                    }
                }
            }

            updateCartTotal();
        } else {
            console.error('Failed to load products');
        }
    };

    xhr.send();
}

// Function to update subtotal for a cart item
function updateSubtotal(cartItemElement, product, newQuantity) {
    let quantity = parseInt(newQuantity);
    let subtotal = quantity * product.price;
    cartItemElement.querySelector('.subtotal').innerText = `$${subtotal}`;

    saveCartToStorage();
}

// Function to update total cost of items in the cart
function updateCartTotal() {
    let cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    cartItems.forEach(cartItem => {
        let subtotal = parseFloat(cartItem.querySelector('.subtotal').innerText.replace('$', ''));
        total += subtotal;
    });

    document.querySelector('.total').innerText = `$${total}`;
    saveCartToStorage();
}



// Function to save cart data to localStorage
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



// Function to update total cost of items in the cart
function updateCartTotal() {
    let cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    cartItems.forEach(cartItem => {
        let itemSubtotal = parseFloat(cartItem.querySelector('.subtotal').innerText.replace('$', ''));
        subtotal += itemSubtotal;
    });

    let shipping = 10; // Example shipping cost
    let total = subtotal + shipping;

    document.querySelector('#subtotal').innerText = `$${subtotal}`;
    document.querySelector('#shipping').innerText = `$${shipping}`;
    document.querySelector('#fullTotal-cart').innerText = `$${total}`;

    saveCartToStorage(); // Save updated cart to localStorage
}

// Event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    requestProducts();
});
