const express = require("express");
const router = express.Router();
const ProductControler = require("../controler/ProductControler");
const multer = require("multer");
const path = require("path");
const uuid = require("uuid");
const passport = require("passport");
const passportConfig = require("../middelwares/passport.js");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/product"); // Định nghĩa thư mục lưu trữ
    },
    filename: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname);
      const timestamp = Date.now();
      const newFileName = `${req.user._id+timestamp}${fileExtension}`;
       cb(null, newFileName);
    },
  }),
});

 router.use(passport.authenticate("jwt", { session: false }));
router.route("/categories").get(ProductControler.getCategories);
router.route("/").get(ProductControler.getProducts).post(ProductControler.addProduct);
router.route("/new").get(ProductControler.getProductsNew);
router.route("/sale").get(ProductControler.getProductsSale);
router.route("/details/:idProduct").get(ProductControler.getDetailsProduct).post(ProductControler.addDetailsProduct);
router.route("/image/:idProduct").get(ProductControler.getImageProduct).post(upload.single( ),ProductControler.addImageProduct);
router.route("/productQuantity/:idProduct").post(ProductControler.addProductQuantity) ;




router.route("/:idCategory").get(ProductControler.getProductByIdCate);
router
  .route("/favourite/:idProduct")
  .post(ProductControler.addFavourite)
  .delete(ProductControler.deleteFavourite) 
  .get(ProductControler.getAllFavourites);
  router.route("/update/:idProduct",ProductControler.updateProduct);


module.exports = router;
