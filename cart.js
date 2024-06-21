
function requestProducts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'products.json', true);

    xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
            let products = JSON.parse(this.responseText);
            let productContainer = document.querySelector('.cart-items');

           
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

                // Append cart item to cart container
                productContainer.appendChild(cartItemElement);

                //update subtotal when quantity changes
                let quantityInput = cartItemElement.querySelector('input[type="number"]');
                quantityInput.addEventListener('change', function() {
                    updateSubtotal(cartItemElement, product);
                    updateCartTotal();
                });

                // to remove item from cart
                let removeButton = cartItemElement.querySelector('.remove-item');
                removeButton.addEventListener('click', function() {
                    cartItemElement.remove();
                    updateCartTotal();
                });
            });

            updateCartTotal();
        } else {
            console.error('Failed to load products');
        }
    };

    xhr.send();
}

// Function to update subtotal of a cart item based on quantity
function updateSubtotal(cartItemElement, product) {
    let quantity = parseInt(cartItemElement.querySelector('input[type="number"]').value);
    let subtotal = quantity * product.price;
    cartItemElement.querySelector('.subtotal').innerText = `$${subtotal}`;
}

// Function to update the total price of the cart
function updateCartTotal() {
    let cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    cartItems.forEach(cartItem => {
        let subtotal = parseFloat(cartItem.querySelector('.subtotal').innerText.replace('$', ''));
        total += subtotal;
    });

    document.querySelector('.subtotal').innerText = `$${total}`;
}

// Initialize the cart when the page loads
document.addEventListener('DOMContentLoaded', function() {
    requestProducts();
});
