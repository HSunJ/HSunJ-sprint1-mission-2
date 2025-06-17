

class Article {
    constructor({title, content, writer}, createdAt, likeCount=0){
        this._title = title;
        this._content = content;
        this._writer = writer;
        this._createdAt = createdAt
        this._likeCount =likeCount;
    }

    get title(){
        return this._title;
    }
    set title(title){
        this._title = title;
    }
    
    get content(){
        return this._content;
    }
    set content(content){
        this._content = content;
    }

    get writer(){
        return this._writer;
    }
    set writer(writer){
        this._writer = writer;
    }

    get createdAt(){
        return this._createdAt;
    }

    get likeCount(){
        return this._likeCount;
    }

    like(){
        this._likeCount++;
    }
}

export default Article;