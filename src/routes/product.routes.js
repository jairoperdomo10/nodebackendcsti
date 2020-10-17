const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controllers");

// Llamar a la función "saludar"
//router.get('/:nombre', ProductController.saludar);
//router.get('/', ProductController.saludar);

// Listar todos los Productos
router.get("/", ProductController.findAll);
// Create a un nuevo Producto
router.post("/", ProductController.create);
// Eliminar un registro de la BBDD
router.delete("/:id", ProductController.delete);

router.put("/:id", ProductController.update);
module.exports = router;
