// /////////////////////////////////////////////// Get Data //////////////////////////////////////// //
let data = [];
let dataSearch = [];
window.onload = function(){
    let xhr = new XMLHttpRequest();
    xhr.open('Get','../api/products.json');
    xhr.onreadystatechange = function (){
        if(xhr.readyState === 4 && xhr.status ===200 ){
            data = JSON.parse(xhr.responseText);
            if(location.pathname =='/index.html'&& location.search ==""){
                saleCard(data.laptop.slice(0,10));  
            }
            else if(location.pathname ==='/404.html'){
                if(location.search ==""){
                    let searchVal = '';
                    searchProduct(searchVal,true)
                }else{
                    let searchVal = location.search.split('search=')[1].split("&")[0];
                    searchProduct(searchVal,true)
                }
            }
            else {
                let searchVal = location.search.split('search=')[1].split("&")[0]; //علشان لو في انبوت تاني ميتلخبطش 
                searchProduct(searchVal,false)
            }
        }
    }
    xhr.send();
    
}
// /////////////////////////////////////////////// Create Sale Card ///////////////////////////////// //
const saleDiv = document.getElementById("sale");

function searchProduct(sValue,erroPage){
    let searchCount = location.search.split('count=')[1]?.split("&")[0];
    let searchResult = []
    for(const cat in data){
            for(const prod of data[cat]){
                if(prod.name.toLowerCase().includes(sValue.toLowerCase())){
                    searchResult.push(prod)
                }
            }
        }
        
        if(erroPage && searchResult.length > 0){
            document.getElementById("error-div").parentElement.remove()
            saleCard(searchResult)
        }
        else {
            saleCard(searchResult)
        }
        
}


function saleCard(data) {
    let cards = data;
    if(dataSearch.length===0){
        dataSearch=data;
    }
    document.getElementById('bar-product-counter').innerHTML = data.length
    saleDiv.innerHTML ='';
    cards.forEach(card => {
        const originalPrice = card.price;
        const salePrice = card.sale_price;
    
        // Main Card Container //
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        saleDiv.appendChild(cardDiv);

        // Discount Span //
     


        // Wish list Icon //
        const favIcon = document.createElement("i");
        favIcon.className = "hover-icon fa-regular fa-heart";
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
        if(salePrice !== null){
            
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
        }else{
            const salePriceSpan = document.createElement("span");
            salePriceSpan.className = "sale-price";  
            priceDiv.appendChild(salePriceSpan);
            salePriceSpan.innerText = originalPrice + " $";
        }

        const cartBtn = document.createElement("button");
        cartBtn.className = "cart-btn";
        cartBtn.classList.add("btn-orange");
        cartBtn.innerText = "Add To Cart";
        cardContent.appendChild(cartBtn);
    }

);
}


function filtterFunction(by){
    switch(by){
        case 'up':
            dataSearch.sort((prod1,prod2)=>prod1.price-prod2.price);
            break;
        case 'down':
            dataSearch.sort((prod1,prod2)=>prod2.price-prod1.price);
            break;
        case 'best':
            dataSearch.sort((prod1, prod2) => {
                debugger;
                if (prod1.product_rating && prod2.product_rating) {
                    return prod2.product_rating.value - prod1.product_rating.value;
                } else if (prod1.product_rating) {
                    return -1;
                } else if (prod2.product_rating) {
                    return 1;
                } else {
                    return 0;
                }
            });
            
            break;
        }
        saleCard(dataSearch);
}