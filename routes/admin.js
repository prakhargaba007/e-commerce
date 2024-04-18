const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const auth = [
  body("title", "Enter a valid title.").isLength({ min: 3 }),
  // body("imageUrl", "Enter a valid image URL.").isURL(),
  body("price", "Enter a valid price.").isFloat(),
  body("description", "Enter a valid description.").isLength({ min: 5 }).trim(),
];

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", isAuth, auth, adminController.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, auth, adminController.postEditProduct);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
