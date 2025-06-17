import { getArticle, getArticleList, patchArticle, deleteArticle, createArticle } from "./ArticleService.js";
import { getProduct, getProductList, patchProduct, deleteProduct, createProduct } from "./ProductService.js";
import Article from "./article.js";
import { Product,ElectronicProduct } from "./product.js";

const product_data = {
  "images": [],
  "tags": [ "new tag" ],
  "price": 1000,
  "description": "new des",
  "name": "new"
};

const article_data = {
    'title': 'patch title',
    'content': 'patch content',
    'image': 'https://example.com/...'
};

const product_params = {
    page: 1,
    pageSize: 3,
    keyword: ''
}

const article_params = {
    page: 5,
    pageSize: 5,
    keyword: ''
}

// const get_pruduct = await getProduct(885);
// console.log(get_pruduct);

const products = await getProductList(product_params);
const articles = await getArticleList(article_params);
console.log(products);

const product_arr = [];
const article_arr = [];

products.list.forEach(item =>{
    if(item.tags.includes('전자제품')){
        const product = new ElectronicProduct(item);
        product_arr.push(product);
    }
    else{
        const product = new Product(item);
        product_arr.push(product);
    }
})
console.log(product_arr);

articles.list.forEach(item =>{
    const article = new Article(item, new Date());
    article_arr.push(article);
})
console.log(article_arr);

// const creat_product = await createProduct(productData);
// console.log(creat_product);

// const patch_product = await patchProduct(886, productData);
// console.log(patch_product);

// const delete_product = await deleteProduct(886);
// console.log(delete_product);

// const get_article = await getArticle(949)
// console.log(get_article);

// const get_articles = await getArticleList(article_params);
// console.log(get_articles);

// const create_article = await createArticle(article_data);
// console.log(create_article);

// const patch_article = await patchArticle(1356, article_data);
// console.log(patch_article);

// const delete_article = await deleteArticle(1356);
// console.log(delete_article);

