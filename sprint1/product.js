

class Product {
    constructor({name, description, price, tags=[], images=[]}, favoriteCount=0) {
        this._name = name;
        this._description = description;
        this._price = price;
        this._tags = tags;
        this._images = images;
        this._favoriteCount = favoriteCount;
    }

    get name(){
        return this._name;
    }
    set name(name){
        this._name = name;
    }

    get description(){
        return this._description;
    }
    set description(description){
        this._description = description;
    }

    get price(){
        return this._price;
    }
    set price(price){
        if(price < 0){
            throw new Error('Price value error');
        }
        else{
            this._price = price;
        }
    }

    get tags(){
        return this._tags;
    }
    set tags(tags){
        this._tags = tags;
    }

    get images(){
        return this._images;
    }
    set images(images){
        this._images = images;
    }

    get favoriteCount(){
        return this._favoriteCount;
    }

    favorite(){
        this._favoriteCount++;
    }
}

class ElectronicProduct extends Product{
    constructor ({name, description, price, tags, images}, manufacturer = 'new man', favoriteCount=0){
        super({name, description, price, tags, images}, favoriteCount);
        this._manufacturer = manufacturer;
    }
}

export {Product, ElectronicProduct};