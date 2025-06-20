export class Product {
    constructor({id=0, name='', image_url='', stock=0, stock_by_location='null', price=0, description='', category='', batch=''}) {
        this.id = id;
        this.name = name;
        this.image_url = image_url;
        this.stock = stock;
        this.stock_by_location = stock_by_location;
        this.price = price;
        this.description = description;
        this.category = category;
        this.batch = batch;
    }

    toJson(){
        return{
            id: this.id,
            name: this.name,
            image_url: this.image_url,
            stock: this.stock,
            stock_by_location: this.stock_by_location,
            price: this.price,
            description: this.description,
            category: this.category,
            batch: this.batch,
        };
    }

    static createEmpty(){
        return new Product({});
    }

    isValid() {
        return this.name !== '' && this.description !== '' && this.category !== '' && this.batch !== '';
    }
}