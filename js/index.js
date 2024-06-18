// /////////////////////////////////////////////// Get Data //////////////////////////////////////// //
let data = [];

fetch('../api/products.json')
    .then(response => response.json())
    .then(res => {
        data = res;
        saleCard(data);
    })
    .catch(error => console.error('Error fetching JSON:', error));

// /////////////////////////////////////////////// Create Sale Card ///////////////////////////////// //
const saleDiv = document.getElementById("sale");

function saleCard(data) {
    let cards = data.laptop.slice(0, 6);
    cards.forEach(card => {
        const originalPrice = card.price;
        const salePrice = card.sale_price;

        if (card.sale_price !== null) {
            // Main Card Container //
        const cardDiv = document.createElement("div");
            cardDiv.className = "card";
            saleDiv.appendChild(cardDiv);

            // Discount Span //
            const saleSpan = document.createElement("span");
            saleSpan.className = "sale";
            cardDiv.appendChild(saleSpan);

            // Wish list Icon //
            const favIcon = document.createElement("i");
            favIcon.className = "hover-icon fa-regular fa-heart";
            cardDiv.appendChild(favIcon);

            const discountPercentage = Math.floor(((originalPrice - salePrice) / originalPrice) * 100) + "%";
            saleSpan.textContent = "Sale " + discountPercentage;

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
            const stars = Math.round(card.product_rating.value);
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

            const salePriceSpan = document.createElement("span");
            salePriceSpan.className = "sale-price";  
            priceDiv.appendChild(salePriceSpan);
            salePriceSpan.innerText = salePrice + " $";

            const priceSpan = document.createElement("span");
            priceSpan.className = "price";
            priceDiv.appendChild(priceSpan);
            priceSpan.innerText = originalPrice + " $";

            const cartBtn = document.createElement("button");
            cartBtn.className = "cart-btn";
            cartBtn.classList.add("btn-orange");
            cartBtn.innerText = "Add To Cart";
            cardContent.appendChild(cartBtn);
        }

    });
}