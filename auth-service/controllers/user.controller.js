import { User } from '../models/User.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all fields")
    }

    const existedUser = await User.findOne({ email })
    if (existedUser) {
        res.status(400)
        throw new Error("User already exists")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({ name, email, password: hashedPassword })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error("Failed to create User")
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error("Please enter all fields")
    }

    const user = await User.findOne({ email })
    if (!user) {
        res.status(400)
        throw new Error("User doesn't exist")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        res.status(400)
        throw new Error("Invalid credentials")
    }

    const payload = {
        email,
        name: user.name
    }

    const token = jwt.sign(payload, "secret", { expiresIn: '1hr' })
    res.status(200).json({ token })
}

export {
    register,
    login
}