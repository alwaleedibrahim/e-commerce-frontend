// Function to request products from a JSON file
function requestProducts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './../api/products.json');

    xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
            let products = JSON.parse(this.responseText);
            let savedCart = JSON.parse(localStorage.getItem('cart')) || [];
            createCard(savedCart)
        } else {
            console.error('Failed to load products');
        }
    };

    xhr.send();
}

let productContainer = document.getElementById("items");

function currentQuantity(product) {
    let productAdded = JSON.parse(localStorage.getItem('cart')) || [];
    let totalQuantity = 0;

    if (product) {
        let productName = product.name;
        totalQuantity = productAdded.reduce((total, prod) => {
            if (prod.name === productName) {
                return total + 1;
            }
            return total;
        }, 0);
    } else {
        totalQuantity = 0;
    }

    defaultQuantity = totalQuantity;
    return totalQuantity;
}
function createCard(data){
    data.forEach(product => {
        let defaultQuantity = currentQuantity(product);
        console.log(defaultQuantity);
        let cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item', 'cart-row');
        cartItemElement.className ="item"

        const words = product.name.trim().split(/\s+/);
        const truncatedText = words.slice(0, 3).join(" ");

        cartItemElement.innerHTML = `
            <div class="item-spacing"> 
                <img src="${product.image_key}">
            </div
            <div class="item-spacing"> 
                <h4>${truncatedText}</h4>
            </div>
            <input type="number" value="${defaultQuantity}" min="1" max="20">
            <div class="item-spacing"> 
                <p>$${product.price*defaultQuantity}</p>
            </div>
                <button class="remove-item">Remove</button>
            `;
        //     <div class="cart-item-details">
                
        //     <p class="subtotal">$${product.price}</p>
        // </div>`;

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


    let shipping = calculateShipping(subtotal, products);
     total = subtotal + shipping;

    document.querySelector('.subtotal').innerText = `$${total}`;
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