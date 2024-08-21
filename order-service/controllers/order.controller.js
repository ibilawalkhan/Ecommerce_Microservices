import { Order } from "../models/order.model.js";
import ampq from 'amqplib'

let channel, connection

async function connectRabbitMQ() {
    const ampqServer = "amqp://localhost:5672"
    try {
        connection = await ampq.connect(ampqServer)
        channel = await connection.createChannel()
        await channel.assertQueue("ORDER")

        console.log("RabbitMQ connected");
        channel.consume("ORDER", (data) => {
            console.log("Consuming ORDER service");
            const { products, userEmail } = JSON.parse(data.content)
            console.log("Products, Email", products, userEmail);
            const newOrder = createOrder(products, userEmail)
            channel.ack(data)
            channel.sendToQueue(
                "PRODUCT",
                Buffer.from(JSON.stringify({ newOrder }))
            )
        })
    } catch (error) {
        console.error("Error in connecting RabbitMQ", err)
    }
}

const createOrder = async (products, userEmail) => {
    try {
        const orders = []
        for (let t = 0; t < products.length; t++) {
            let order = new Order({
                products,
                total_price: products[t].quantity,
                user: userEmail
            })

            const savedOrder = await order.save()
            orders.push(savedOrder)
        }
        return orders
    } catch (error) {
        console.log("Error in creating order", error)
    }
}

export {
    createOrder,
    connectRabbitMQ
}