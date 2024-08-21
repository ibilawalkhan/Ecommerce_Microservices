import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: String,
    products: [
        {
            productId: String
        },
    ],
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Order = mongoose.model("Order", orderSchema);