
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app'
});

export async function getProductList(params = {}){
    try{
        const res = await instance.get('/products', {params});
        return res.data
    }
    catch (err) {
        console.log(err?.response?.status || 'request failed');
    }
}

export async function getProduct(id){
    try{
        const res = await instance.get(`/products/${id}`);
        return res.data
    }
    catch (err) {
        console.log(err?.response?.status || 'request failed');
    }
}

export async function createProduct(product_data){
    try{
        const res = await instance.post('/products', product_data);
        return res.data
    }
    catch (err) {
        console.log(err?.response?.status || 'request failed');
    }
}

export async function patchProduct(id, product_data){
    try{
        const res = await instance.patch(`/products/${id}`, product_data);
        return res.data
    }
    catch (err) {
        console.log(err?.response?.status || 'request failed');
    }
}

export async function deleteProduct(id){
    try{
        const res = await instance.delete(`/products/${id}`);
        return res.data
    }
    catch (err) {
        console.log(err?.response?.status || 'request failed');
    }
}