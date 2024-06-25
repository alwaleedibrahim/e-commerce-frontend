document.addEventListener('DOMContentLoaded', () => {
    if (location.pathname.includes('/pages/favorites.html')){
        favouriteCards();
    }
});

function favIconFunc(prod, icon) {
    let favProducts = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favProducts.findIndex(item => item.name === prod.name);
    icon.classList.toggle("fa-solid")
    if (index === -1) {
        favProducts.push(prod);
    } else {
        favProducts.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favProducts));
    if (location.pathname.includes('/pages/favorites.html')){
        favouriteCards();
    }
}

function favouriteCards() {
    const favContainer = document.getElementById("favorites-container");
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if(favContainer){
        favContainer.innerHTML = '';
    }
    favorites.forEach(card => {
        const originalPrice = card.price;
        const salePrice = card.sale_price;

        // Main Card Container //
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        favContainer.appendChild(cardDiv);

        // Wish list Icon //
        const favIcon = document.createElement("i");
        favIcon.className = "hover-icon fov-icon fa-regular fa-trash-can";

        favIcon.classList.add("foved-icon")
        
        favIcon.onclick = (event)=>{
              favIconFunc(card,favIcon)
          };
        
        cardDiv.appendChild(favIcon);

        // Images Container //
        const imagesDiv = document.createElement("div");
        imagesDiv.className = "imagesi-div";
        cardDiv.appendChild(imagesDiv);

        const mainImage = document.createElement("img");
        mainImage.id = "main-image";
        mainImage.src = card.image_key;
        imagesDiv.appendChild(mainImage);

        const images = document.createElement("div");
        images.className = "images";
        imagesDiv.appendChild(images);

        const productImages = card.image_keys.slice(0, 3);

        productImages.forEach((ele) => {
            const img = document.createElement("img");
            img.src = ele;
            images.appendChild(img);
        });

        // Card Content Container //
        const cardContent = document.createElement("div");
        cardContent.className = "card-content";
        cardDiv.appendChild(cardContent);

        const titleCard = document.createElement("h5");
        titleCard.className = "title-card";
        cardContent.appendChild(titleCard);
        const words = card.name.trim().split(/\s+/);
        const truncatedText = words.slice(0, 4).join(" ");

        titleCard.style.textTransform = "capitalize";
        titleCard.innerText = truncatedText;

        // Rating Logic //
        const ratingContainer = document.createElement("div");
        ratingContainer.id = "stars-div";
        ratingContainer.innerHTML = `
                    <i class="rate stars fa-solid fa-star"></i>
                    <i class="rate stars fa-solid fa-star"></i>
                    <i class="rate stars fa-solid fa-star"></i>
                    <i class="rate stars fa-solid fa-star"></i>
                    <i class="rate stars fa-solid fa-star"></i>
                    `
        cardContent.appendChild(ratingContainer);
        ratingContainer.style.margin = "0.5rem 0";

        const getStars = ratingContainer.querySelectorAll(".rate");
        const stars = Math.round(card.product_rating?.value);
        getStars.forEach((ele, index) => {
            if (index < stars) {
                ele.classList.add("stars-filled");
                ele.classList.remove("stars");
            } else {
                ele.classList.add("stars");
                ele.classList.remove("stars-filled");
            }
        });

        const priceDiv = document.createElement("div");
        priceDiv.className = "price-div";
        cardContent.appendChild(priceDiv);
        // price logic
        if (salePrice !== null) {
            const saleSpan = document.createElement("span");
            saleSpan.className = "sale";
            cardDiv.appendChild(saleSpan);
            const discountPercentage = Math.floor(((originalPrice - salePrice) / originalPrice) * 100) + "%";
            saleSpan.textContent = "Sale " + discountPercentage;

            const salePriceSpan = document.createElement("span");
            salePriceSpan.className = "sale-price";
            priceDiv.appendChild(salePriceSpan);
            salePriceSpan.innerText = originalPrice + " $";

            const priceSpan = document.createElement("span");
            priceSpan.className = "price";
            priceDiv.appendChild(priceSpan);
            priceSpan.innerText = originalPrice + " $";
        } else {
            const salePriceSpan = document.createElement("span");
            salePriceSpan.className = "sale-price";
            priceDiv.appendChild(salePriceSpan);
            salePriceSpan.innerText = originalPrice + " $";
        }

        const cartBtn = document.createElement("button");
        cartBtn.className = "cart-btn";
        cartBtn.classList.add("btn-orange");
        cartBtn.innerText = "More Details";
        cardContent.appendChild(cartBtn);

        cartBtn.addEventListener("click", () => {
            setData(card); 
            window.location.href = "./../pages/product.html";
        });
    });
}


////////////////////////////set data for product


function setData(product) {
    let url = new URL(window.location);
    url.searchParams.set('product', JSON.stringify(product));
    window.history.pushState({}, '', url);
    localStorage.setItem('product', JSON.stringify(product));
}
