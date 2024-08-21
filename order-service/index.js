import express from 'express'
import connectDB from './db/index.js'
import dotenv from 'dotenv'
import { connectRabbitMQ } from './controllers/order.controller.js'

dotenv.config()

const app = express()
const port = 8000

app.use(express.json())

const startServer = async () => {
    try {
        await connectDB()
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })

        await connectRabbitMQ()
    } catch (error) {
        console.error('Error starting the server:', error)
    }
}

startServer()