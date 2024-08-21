import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: String
}, { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);