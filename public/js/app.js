// import stockPrice from './stock-price.js';
import products from './products.js';

class App {

    constructor() {
        console.log("hello");
        if (this.getUrlParam()) {
            this.id = this.getUrlParam().match(/\d+/g);
            this.model = this.getUrlParam().match(/[a-zA-Z]+/g);
            this.pdp();
        } else {
            this.home();
        }
    }
    convertPrices(price) {
        let USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return USDollar.format(price / 100);
    }
    pdp() {
        const product = this.getSingleBeer(this.id);

        const template = document.getElementById('productTemplate');
        const templateContent = template.content;

        const SKU = product.skus[0].code;
        const item = templateContent.querySelector('.product');
        item.id = SKU;
        const itemTitle = templateContent.querySelector('.product-brand');
        itemTitle.textContent = product.brand;
        const itemImage = templateContent.querySelector('.product-img img');
        itemImage.src = "img" + product.image;

        const itemOrigin = templateContent.querySelector('.origin');
        itemOrigin.textContent = product.origin;
        const itemDescription = templateContent.querySelector('.product-description');
        itemDescription.textContent = product.information;

        const itemPrice = templateContent.querySelector('.product-price');

        const newProduct = templateContent.cloneNode(true);
        document.querySelector(".product-detail .row").appendChild(newProduct);

        this.updateSizesBtns(product);

        this.updateStockPrice(SKU, product);
        let that = this;
        const interval = setInterval(function () {
            that.updateStockPrice(SKU, product);
        }, 5000);

    }
    updateSizesBtns(product) {

        document.querySelector("#sizes").textContent = ""; // EMPTY

        const SKUS = product.skus;
        SKUS.forEach(SKU => {
            this.getStockPrice(SKU.code).then((stockPrice) => {

                const template = document.getElementById('sizeBtn');
                const templateContent = template.content;
                const sizeBtn = templateContent.querySelector('.size-btn');
                sizeBtn.href = "/" + product.id + product.brand.toLowerCase().replace(/\s/g, '');
                sizeBtn.textContent = SKU.name;

                const newBtn = templateContent.cloneNode(true);
                document.querySelector("#sizes").appendChild(newBtn);
            });
        })

    }
    updateStockPrice(SKU, product) {
        this.getStockPrice(SKU).then((stockPrice) => {
            console.log("result: " + stockPrice.price);
            document.getElementById(SKU).querySelector(".product-price").innerHTML = this.convertPrices(stockPrice.price);
            document.getElementById(SKU).querySelector(".stock").textContent = stockPrice.stock;
        });
    }
    home() {
        const productList = this.getAllBeers();
        // use template for each product

        const template = document.getElementById('productTemplate');
        const templateContent = template.content;

        productList.forEach(product => {
            const SKU = product.skus[0].code;
            const item = templateContent.querySelector('.product');
            item.id = SKU;
            const itemTitle = templateContent.querySelector('.product-brand');
            itemTitle.textContent = product.brand;
            const itemImage = templateContent.querySelector('.product-img img');
            itemImage.src = "img" + product.image;
            const itemPrice = templateContent.querySelector('.product-price');

            const newProduct = templateContent.cloneNode(true);

            document.querySelector(".product-list .row").appendChild(newProduct);
            this.getStockPrice(SKU).then((stockPrice) => {
                console.log("result: " + stockPrice.price);
                document.getElementById(SKU).querySelector(".product-price").innerHTML = this.convertPrices(stockPrice.price);
                document.getElementById(SKU).querySelector(".add-btn").onclick = function () {
                    document.location.href = "/" + product.id + product.brand.toLowerCase().replace(/\s/g, '');
                };
            });
        });


    }
    // • Mock an API endpoint that returns stock and price informaHon for a given
    // product SKU code (feel free to use any approach you feel comfortable with).
    getStockPrice = async (SKU) => {
        const url = `/api/stockprice/${SKU}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        if (responseJson) {
            return responseJson;
        }
    }

    getSingleBeer(id) {
        const product = products.find(x => x.id === parseInt(id));
        return product;

    }
    getAllBeers() {
        return products;
        // fetch("js/products.js")
        //     .then((res) => res.json())
        //     .then((data) => { console.log(data) }
        //     );
    }
    getUrlParam() {
        return window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
    }

}
const beerStore = new App(); 
