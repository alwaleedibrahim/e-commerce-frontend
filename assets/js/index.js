// /////////////////////////////////////////////// Get Data //////////////////////////////////////// //
let data = [];
let dataSearch = [];
window.onload = function () {
    let xhr = new XMLHttpRequest();
    xhr.open('Get', './../api/products.json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            data = JSON.parse(xhr.responseText);
            if (location.pathname.includes('/pages/index.html')  && location.search == "") {
                saleCard(data.laptop.slice(0, 10));
            }
            else if (location.pathname.includes('/pages/category.html')) {
                let cat = location.search.split('cat=')[1].split("&")[0];
                dataSearch = data[cat];
                card(data[cat],document.getElementById("sale"))
                document.getElementById("bar-product-counter").innerText = data[cat].length
            }
            else if (location.pathname.includes('/pages/product.html')) {
                if(localStorage.getItem("product")){
                    showProductPage()
                    secSaleCard(data);
                }else{
                    location.href = "./../pages/index.html"
                }
            }
            else if (location.pathname.includes('/pages/home.html')) {
                homeCard(data);
                bestSellingCard(data);
                flashSaleCard(data);
                setInterval(offerTimer,1000);
            }
            else if(location.pathname.includes('/pages/cart.html')){
                //  لا اله الا الله محمد رسول الله
            }
            else {
                let search = location.search.split('search=')[1] ? location.search.split('search=')[1] : ""
                let searchVal = search.split("&")[0]; //علشان لو في انبوت تاني ميتلخبطش 
                searchProduct(searchVal)
            }
        }
    }
    xhr.send();
}

// //////////////////////////////////////////// LocalStorage Functions ///////////////////////////////// //
function setData(product) {
    let url = new URL(window.location);
    url.searchParams.set('product', JSON.stringify(product));
    window.history.pushState({}, '', url);
    localStorage.setItem('product', JSON.stringify(product));
}

function getData() {
    let urlParams = new URLSearchParams(window.location.search);
    let product = urlParams.get('product') || localStorage.getItem('product');
    return product;
}

let productData = getData();
let product = JSON.parse(productData); 
// //////////////////////////////////////////// Create Sale Card ///////////////////////////////// //
function card(data, div) {
    let cards = data;

    cards.forEach(card => {
        const originalPrice = card.price;
        const salePrice = card.sale_price;

        // Main Card Container //
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        div.appendChild(cardDiv);

        // Wish list Icon //
        const favIcon = document.createElement("i");
        favIcon.className = "hover-icon fa-regular fa-heart";
        let favProducts = JSON.parse(localStorage.getItem('favorites')) || [];

        favProducts.forEach((ele)=>{
            if(ele.name==card.name){
                favIcon.classList.add("foved-icon")
                favIcon.classList.toggle("fa-solid")
            }
        })
        favIcon.onclick = (event)=>{
            favIcon.classList.toggle("foved-icon")
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
            salePriceSpan.innerText = salePrice + " $";

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
            // currentQuantity();
            window.location.href = "./../pages/product.html";
        });
    });
}

const secSaleDiv = document.getElementById("sec-sale");

function secSaleCard(data) {
    let cards = data.laptop.slice(0, 4);
    card(cards, secSaleDiv);
}

const exploreDiv = document.getElementById("explore-products-cards");

function homeCard(data) {
    let cards = data.television.slice(0, 6);
    card(cards, exploreDiv);
}

const bestSellingDiv = document.getElementById("best-selling-cards");

function bestSellingCard(data) {
    let cards = data.mobiles.slice(0, 4);
    card(cards, bestSellingDiv);
}

// flash-sale-cards
const flashSaleDiv = document.getElementById("flash-sale-cards");

function flashSaleCard(data) {
    let cards = data.laptop.slice(0, 6);
    let saleCards = []
    cards.forEach((ele)=>{
        if(ele.sale_price !== null){
            saleCards.push(ele)
        }
    })
    card(saleCards, flashSaleDiv);
}



// ////////////////////////////////////////// Filter Functions /////////////////////////////////////// //
const saleDiv = document.getElementById("sale");

function saleCard(data) {
    console.log(dataSearch)
    console.log(12)
    if (dataSearch.length === 0) {
        console.log(12)
        dataSearch = data;
    }
    document.getElementById('bar-product-counter').innerHTML = data.length
    saleDiv.innerHTML = '';
    card(data, saleDiv)
}

function searchProduct(sValue) {
    let searchResult = []
    for (const cat in data) {
        for (const prod of data[cat]) {
            if (prod.name.toLowerCase().includes(sValue.toLowerCase())) {
                searchResult.push(prod)
            }
        }
    }

    if (searchResult.length == 0) {
        location.href = "./../pages/404.html";
    }
    else{
        saleCard(searchResult)
    }

}


function filtterFunction(by) {
    switch (by) {
        case 'up':
            dataSearch.sort((prod1, prod2) => prod1.price - prod2.price);
            break;
        case 'down':
            dataSearch.sort((prod1, prod2) => prod2.price - prod1.price);
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


// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// 
// 
// 
// 
// 
// 
// 
// 
// 
// ///////////////////////////////////////////////////////////////////////////////////////////////////////// //

// ///////////////////////////////////////////////Start Product Code//////////////////////////////////////// //

 function showProductPage(){
    ///////////////////// Card Functions /////////////////////
    let defaultQuantity = 0;

    // let productAdded = JSON.parse(localStorage.getItem('cart')) || [];

    function currentQuantity() {
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

    function decreasing(prod) {
        let productAdded = JSON.parse(localStorage.getItem('cart')) || [];
        if (defaultQuantity > 0) {
            defaultQuantity --;
            const index = productAdded.findIndex(item => item.name === prod.name);
            if (index !== -1) {
                productAdded.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(productAdded));
                currentQuantity();
                quantitySpan.innerHTML = defaultQuantity;
            }
        }
    }

    function increasing(card) {
        let productAdded = JSON.parse(localStorage.getItem('cart')) || [];
        defaultQuantity++;
        productAdded.push(card);
        localStorage.setItem('cart', JSON.stringify(productAdded));
        currentQuantity();
        quantitySpan.innerHTML = defaultQuantity;
    }

    currentQuantity();

    // ////////////////////////////////// Get Product //////////////////////////////// //
    const imagesProduct = document.getElementById("images-product-container");
    const mainProductContent = document.getElementById("main-product-content");

    // Images Product //
            console.log(product)
    const productImages = product.image_keys.slice(0, 4);
    const productImgsDiv = document.createElement("div");
    productImgsDiv.id = "product-imgs-div"
    imagesProduct.appendChild(productImgsDiv)

    productImages.forEach((ele) => {
        const productImgs = document.createElement("img");
        productImgs.className = "product-imgs";
        productImgs.src = ele;
        productImgsDiv.appendChild(productImgs);
    });


    const mainProductImage = document.createElement("img");
    mainProductImage.id = "main-product-img";
    mainProductImage.src = product.image_key;
    imagesProduct.appendChild(mainProductImage);

    imagesProduct.appendChild(mainProductImage);


    // Create Content //
    const productTitle = document.createElement("h3");
    productTitle.id = "product-title";
    const words = product.name.trim().split(/\s+/);
    const truncatedText = words.slice(0, 4).join(" ");

    productTitle.style.textTransform = "capitalize";
    productTitle.textContent = truncatedText;

    mainProductContent.appendChild(productTitle);

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
    mainProductContent.appendChild(ratingContainer);
    ratingContainer.style.margin = "0.5rem 0";

    const getStars = ratingContainer.querySelectorAll(".rate");
    const stars = Math.round(product.product_rating?.value);
    getStars.forEach((ele, index) => {
        if (index < stars) {
            ele.classList.add("stars-filled");
            ele.classList.remove("stars");
        } else {
            ele.classList.add("stars");
            ele.classList.remove("stars-filled");
        }
    });

    const priceSpan = document.createElement("span");
    priceSpan.className = "product-price";
    mainProductContent.appendChild(priceSpan);
    priceSpan.innerText = product.price + " $";

    const description = document.createElement("p");
    description.className = "product-description";
    mainProductContent.appendChild(description);
    description.innerText = product.name;

    // Second Product Section //
    const dataProductContent = document.getElementById("data-product-content");

    const brand = document.createElement("h4");
    brand.innerHTML = "Brand: " + product.brand_code;
    dataProductContent.appendChild(brand);

    const avilable = document.createElement("h5");
    avilable.innerHTML = "In Stock";
    avilable.style.color = "var(--break-color)"
    dataProductContent.appendChild(avilable);

    const productInfo = document.createElement("div");
    productInfo.className = "product-info"

    for (const key in product.plp_specifications) {
        if (product.plp_specifications.hasOwnProperty(key)) {
            const productInfoSpan = document.createElement("span");
            const value = product.plp_specifications[key];
            productInfoSpan.innerHTML = value;
            productInfo.appendChild(productInfoSpan);
        }
    }

    dataProductContent.appendChild(productInfo)

    const dataDiv = document.createElement("div");
    dataDiv.className = "data-div";
    dataProductContent.appendChild(dataDiv);

    const quantityDiv = document.createElement("div");
    quantityDiv.className = "quantity-div";
    dataDiv.appendChild(quantityDiv);

    const decreasingBtn = document.createElement("button");
    decreasingBtn.className = "decreasing-btn";
    decreasingBtn.innerHTML = "-";
    decreasingBtn.addEventListener("click", ()=> decreasing(product));
    quantityDiv.appendChild(decreasingBtn);

    const quantitySpan = document.createElement("span");
    quantitySpan.className = "current-quantity";
    quantitySpan.innerHTML = defaultQuantity;
    quantityDiv.appendChild(quantitySpan);

    const increasingBtn = document.createElement("button");
    increasingBtn.className = "increasing-btn";
    increasingBtn.innerHTML = "+";
    increasingBtn.addEventListener("click", () => increasing(product));
    quantityDiv.appendChild(increasingBtn);

    const buyBtn = document.createElement("button");
    buyBtn.className = "buy-btn";
    buyBtn.innerText = "Buy Now";
    buyBtn.classList.add("btn-orange");
    buyBtn.addEventListener("click", () => {
        window.open("./../pages/cart.html", "_self");
    });
    dataDiv.appendChild(buyBtn);
   
    const faveIcon = document.createElement("i");
    faveIcon.className = "heart-icon fa-heart";
    let favProducts = JSON.parse(localStorage.getItem('favorites')) || [];
    faveIcon.classList.add('fa-regular');
    favProducts.forEach((ele)=>
        {
            if(ele.name=== product.name){
                // faveIcon.style.color = "var(--secondary-color)";
                faveIcon.classList.add('fa-solid');
                faveIcon.classList.toggle("foved-product")
            }
    })
    faveIcon.onclick = (event)=>{
        // console.log(14444443)
        faveIcon.classList.toggle("foved-product")
        favIconFunc(product,faveIcon)
    };
    dataDiv.appendChild(faveIcon);

    const productRoles = document.createElement("div");
    productRoles.innerHTML = `
                <div id="delvery-div">
                    <i class="fa-solid fa-truck-fast"></i>
                    <div id="delivery-info">
                        <h5>Free Delivery</h5>
                        <p>Enter your postal code for Delivery Availability</p>
                    </div>
                </div>
                <div id="return-div">
                    <i class="fa-solid fa-rotate-left"></i>
                    <div id="return-info">
                        <h5>Return Delivery</h5>
                        <p>Free 30 Days Delivery Returns. Details</p>
                    </div>
                </div>
            `

    dataProductContent.appendChild(productRoles);

}
// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// 
// 
// 
// 
// 
// 
// 
// 
// 
// ///////////////////////////////////////////////////////////////////////////////////////////////////////// //

// /////////////////////////////////////////////// Start Home Code //////////////////////////////////////// //


function getDifferenceTwoDate(date1, date2) {

    const ms1 = date1.getTime();
    const ms2 = date2.getTime();

    const diffMs = Math.abs(ms1 - ms2);

    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diffMs % (60 * 1000)) / 1000);
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}


function offerTimer(){
    let theCurrntDate = new Date();
    let offerDate = new Date('6-30-2024');
    let counterDate = getDifferenceTwoDate(theCurrntDate,offerDate);
    offerDate.setDate(theCurrntDate.getDate()+5);
    document.getElementsByClassName('offer-timer-value')[0].innerText = counterDate.days;
    document.getElementsByClassName('offer-timer-value')[1].innerText = counterDate.hours;
    document.getElementsByClassName('offer-timer-value')[2].innerText = counterDate.minutes;
    document.getElementsByClassName('offer-timer-value')[3].innerText = counterDate.seconds;
}

// /////////////////////////////////////////////// End Home Code //////////////////////////////////////// //

