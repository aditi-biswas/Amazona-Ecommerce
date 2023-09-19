import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name : {type: String, required: true, unique: true},
        slug : {type: String, required: true, unique: true},
        category: {type: String},
        image: {type: String, required: true},
        price: {type: Number, required: true},
        countInStock: {type: Number, required: true},
        brand: {type: String, required: true},
        rating: {type: Number, required: true},
        numReviews: {type: Number, required: true},
        description: {type: String, required: true},
    },
    {
        timestamps: true // to keep record when schema was last updated etc
    } //gives createdAt and updatedAt time
); //accepts ans object which defines the fields of the schema

const Product = mongoose.model('Product', productSchema);

export default Product;