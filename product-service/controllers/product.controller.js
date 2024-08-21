import { Product } from '../models/Product.model.js'
import ampq from 'amqplib'

let channel, connection

const connectRabbitMQ = async () => {
    const ampqServer = "amqp://localhost:5672"
    try {
        connection = await ampq.connect(ampqServer)
        channel = await connection.createChannel()
        await channel.assertQueue("PRODUCT")
        await channel.assertQueue("ORDER")

        console.log("RabbitMQ connected");

        channel.consume("ORDER", (data) => {
            console.log("Consuming ORDER service");
            const { products, userEmail } = JSON.parse(data.content.toString())
            console.log("Products, Email:", products, userEmail);
            channel.ack(data)
        })
    } catch (error) {
        console.error("Error in connecting RabbitMQ", error)
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const product = await Product.create({ name, description, price });
        if (!product) return res.status(500).json({ error: 'Something went wrong' });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const buyProduct = async (req, res) => {
    try {
        const { ids } = req.body

        const products = await Product.find({ _id: { $in: ids } })

        if (!products) {
            return res.status(404).json({ error: 'Products not found' })
        }

        channel.sendToQueue(
            "ORDER",
            Buffer.from(
                JSON.stringify({
                    products,
                    userEmail: req.user.email
                })
            )
        )

        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

connectRabbitMQ()

export {
    createProduct,
    buyProduct
}
