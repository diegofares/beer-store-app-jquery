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
        const SKU = product.skus[0].code;

        let productTemplate = $('.productTemplate').clone();
        productTemplate.find('.product').attr("id", SKU);
        productTemplate.find('.product-brand').text(product.brand);
        productTemplate.find('.product-img img').attr("src", "img" + product.image);
        productTemplate.find('.origin').text(product.origin);
        productTemplate.find('.product-description').text(product.information);
        productTemplate.find('.product-description').text(product.information);

        $(".product-detail .row").append(productTemplate);

        this.updateSizesBtns(product);

        this.updateStockPrice(SKU, product);
        let that = this;
        const interval = setInterval(function () {
            that.updateStockPrice(SKU, product);
        }, 5000);

    }
    updateSizesBtns(product) {

        $("#sizes").empty(); // EMPTY

        const SKUS = product.skus;
        SKUS.forEach(SKU => {
            this.getStockPrice(SKU.code).then((stockPrice) => {

                let sizeBtn = $('#sizeBtn .size-btn').clone();
                sizeBtn.attr("href", "/" + product.id + product.brand.toLowerCase().replace(/\s/g, ''));
                sizeBtn.text(SKU.name);

                $("#sizes").append(sizeBtn);
            });
        })

    }
    updateStockPrice(SKU, product) {
        this.getStockPrice(SKU).then((stockPrice) => {
            console.log("result: " + stockPrice.price);
            $("#" + SKU + " .product-price").html(this.convertPrices(stockPrice.price));
            $("#" + SKU + " .stock").text(stockPrice.stock);
        });
    }
    home() {
        const productList = this.getAllBeers();

        productList.forEach(product => {

            const productTemplate = $('.d-none .productTemplate > div').clone();

            const SKU = product.skus[0].code;
            productTemplate.find('.product').attr("id", SKU);
            productTemplate.find('.product-brand').text(product.brand);
            productTemplate.find('.product-img img').attr("src", "img" + product.image);

            $(".product-list > .row").append(productTemplate);

            this.getStockPrice(SKU).then((stockPrice) => {
                console.log("result: " + stockPrice.price);
                $("#" + SKU + " .product-price").html(this.convertPrices(stockPrice.price));
                $("#" + SKU + " .add-btn").on("click", function () {
                    document.location.href = "/" + product.id + product.brand.toLowerCase().replace(/\s/g, '');
                });
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
