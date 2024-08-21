import express from 'express'
import connectDB from './db/index.js'
import dotenv from 'dotenv'
dotenv.config()

import productRoute from './routes/product.routes.js'

const app = express()
const port = 5000

app.use(express.json())

app.use("/api/v1/product", productRoute)

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Product-service listening on port ${port}`)
    })
})