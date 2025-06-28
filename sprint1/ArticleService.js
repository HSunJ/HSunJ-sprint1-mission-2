
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app'
});

export async function getArticleList(params = {}){
    return instance.get('/articles/', {params})
        .then((response) => response.data )
        .catch((err) => {
            console.log(err?.response?.status || 'request failed');
        });
        
}

export async function getArticle(id){
    return instance.get(`/articles/${id}`)
        .then((response) => response.data )
        .catch((err) => {
            console.log(err?.response?.status || 'request failed');
        });
}

export async function createArticle(article_data){
    return instance.post('/articles/', article_data)
        .then((response) => response.data )
        .catch((err) => {
            console.log(err?.response?.status || 'request failed');
        });
}

export async function patchArticle(id, article_data){
    return instance.patch(`/articles/${id}`, article_data)
        .then((response) => response.data )
        .catch((err) => {
            console.log(err?.response?.status || 'request failed');
        });
}

export async function deleteArticle(id){
    return instance.delete(`/articles/${id}`)
        .then((response) => response.data )
        .catch((err) => {
            console.log(err?.response?.status || 'request failed');
        });
}