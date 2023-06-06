import { Router } from "express";
import ProductManager from "../datos/ManagerProducts.js";
import { validateProduct } from "../utils/index.js";
const productRouter = Router();

const manager = new ProductManager();


productRouter.get("/", async (req, res) => {
    let productos = await manager.getProducts()
    const limit = req.query.limit;
    if (limit){
        res.send(productos.slice(0, limit));
    }else{
        res.send(productos);
    }
})

productRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let producto = await manager.getProductById(pid)
    res.send(producto);
})

productRouter.post("/", async (req, res) => {
    let product = req.body;
    if (!validateProduct(product)){
        res.status(400).send({ status: "error", message: "producto incompleto" })
    }
    product.id = await manager.getNextId();
    product.status = true;
    await manager.addProduct(product);
    res.send({ status: "success", message: "producto agregado" })
})

productRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let fields = req.body;
    let updatedProd = await manager.updateProduct(pid, fields);
    if(!updatedProd){
        res.status(404).send({ status: "error", message: "no se pudo actualizar el producto" })
    }
    res.send({ status: "success", message: `Producto ${updatedProd.id} actualizado` }) 
})

productRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let deletedProd = await manager.deleteProduct(pid);
    if(!deletedProd){
        res.status(404).send({ status: "error", message: "producto no encontrado, no se pudo eliminar" })
    }
    res.send({ status: "success", message: `Producto ${deletedProd.id} eliminado` })
})

export default productRouter;