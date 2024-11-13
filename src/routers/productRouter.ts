import productController from "../controllers/productController";
import { Router } from "express";
import { validator } from "../middleware/validator";
import { createProductModal, updateProductModal } from "../modals/productSchema/productSchemaValidation";
import { authMiddleware } from "../controllers/authenticationController";

const productRouter = Router();

productRouter.post('/create-product', authMiddleware, validator(createProductModal), productController.createProduct);
productRouter.get('/single-product/:id', authMiddleware, productController.getSingleProduct);
productRouter.get('/getAll-products', authMiddleware, productController.getAllProducts);
productRouter.delete('/delete-product/:id', authMiddleware, productController.deleteProduct);
productRouter.put('/update-product/:id', authMiddleware, validator(updateProductModal), productController.updateProduct)
productRouter.get('/search-products', authMiddleware, productController.searchProducts)
productRouter.delete('/multipleDelete-products', authMiddleware, productController.multipleDelete)
productRouter.get('/low-products', authMiddleware, productController.lowProducts)

export default productRouter;