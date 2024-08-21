import { Router } from 'express'
import { createProduct, buyProduct } from '../controllers/product.controller.js'
import isAuthenticated from '../../middleware/authenticator.js'

const router = Router()

router.route("/create").post(isAuthenticated, createProduct)
router.route("/buy").post(isAuthenticated, buyProduct)


export default router