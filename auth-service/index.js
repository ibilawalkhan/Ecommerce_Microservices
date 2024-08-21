import express from 'express'
import connectDB from './db/index.js'
import dotenv from 'dotenv'
dotenv.config()

import registerRoute from './routes/user.routes.js'

const app = express()
const port = 3000

app.use(express.json())

app.use("/api/v1/auth", registerRoute)

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Auth-service listening on port ${port}`)
    })
})