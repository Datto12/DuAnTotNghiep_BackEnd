const mongoose = require("mongoose");
const {
  Product,
  ProductDetail,
  ImageProduct,
  ImageQuantity,
} = require("../model/product");
const Category = require("../model/category");
const Favourite = require("../model/favourite");
const { DetailOrder } = require("../model/order");

const addProduct = async (req, res) => {
  const { name, price, sold, sale, description, idCata } = req.body;
  const newProduct = await new Product({
    name,
    price,
    sold,
    sale,
    description,
    star: 0.0,
    idCata,
  }).save();
  res.status(201).send(newProduct);
};

const updateProduct = async(req,res) =>{
  const idProduct = req.params.idProduct;
  const updateProduct = {
    name : req.body.name,
    sold : req.body.sold,
    sale : req.body.sale,
    price : req.body.price,
    description : req.body.description,
    idCata : req.body.idCata,
    star : req.body.star,
  };
  Product.findByIdAndUpdate(idProduct,updateProduct,{new :true})
  .then((data)=>{
    if(data){
      res 
      .status(200)
      .json({message:"Cập nhật thành công", data : data});

    }else{
      res.status(404).json({error:"Không tìm thấy dữ liệu"});
    }
  }).catch((error)=>{
    res.status(500).json({error :"Đã xảy ra lỗi"});
  });
}

const addDetailsProduct = async (req, res) => {
  const idProduct =req.params.idProduct;
  const {   size } = req.body;
  const newProductDetail = await new ProductDetail({
    idProduct,
    size,
  }).save();
  res.status(201).send(newProductDetail);
};

const addImageProduct = async (req, res) => {
  const idProduct =req.params.idProduct;
  const {  color } = req.body;
  const host = req.hostname;
  const filePath = req.protocol + "://" + host + "/" + req.file.path;
  const imageProduct = await new ImageProduct({
    idProduct,
    color,
    filePath,
  }).save();
  res.status(201).send(imageProduct);
};

const getImageProduct = async (req, res) => {
  const idProduct =req.params.idProduct;
  const images = await ImageProduct.find({ idProduct });
  res.status(200).send(images);
};

const addProductQuantity = async (req, res) => {
  const { idProductDetail, imageProduct, quantity } = req.body;
  try {
    const newProductQuantity = await new ImageQuantity({
      idProductDetail,
      imageProduct,
      quantity,
    }).save();
    const updatedProductDetail = await ProductDetail.findByIdAndUpdate(
      idProductDetail,
      {
        $push: { imageProductQuantity: newProductQuantity._id },
      },
      { new: true }
    );
    res.status(200).send(updatedProductDetail);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProducts = async (req, res, next, sortField = null) => {
  try {
    const query = Product.find({}).populate({
      path: "productDetails",
      options: { limit: 1 },
      populate: {
        options: { limit: 1 },
        path: "imageProductQuantity",
        populate: {
          path: "imageProduct",
          options: { limit: 1 },
        },
      },
    });

    if (sortField) {
      query.sort({ [sortField]: -1 });
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getProductsSale = (req, res, next) => {
  getProducts(req, res, next, "sale");
};

const getProductsNew = (req, res, next) => {
  getProducts(req, res, next, "timeCreateAt");
};

const addFavourite = async (req, res, next) => {
  const productId = req.params.idProduct;
  const userId = req.user._id;
  const favourite = new Favourite({
    idProduct: productId,
    idUser: userId,
  });
  return favourite
    .save()
    .then((result) => {
      res.json({ message: `Add success` });
    })
    .catch((error) => {
      res.json({ error: `${error.message}` });
    });
};

const deleteFavourite = async (req, res, next) => {
  const productId = req.params.idProduct;
  const userId = req.user._id;
  return Favourite.deleteOne({ idProduct: productId, idUser: userId })
    .exec()
    .then((result) => {
      if (result.deletedCount === 1) {
        res.json({ message: `Delete success` });
      }
    })
    .catch((error) => {
      res.json({ error: `${error.message}` });
    });
};

const getAllFavourites = async (req, res, next) => {
  try {
    const favourite = await Favourite.findOne({
      idUser: req.user._id,
    });
    if (!favourite) return res.status(200).json([]);

    const product = await Product.find({
      _id: { $in: favourite.idProduct },
    }).populate({
      path: "productDetails",
      populate: {
        path: "imageProductQuantity",
        populate: {
          path: "imageProduct",
        },
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getProductByIdCate = async (req, res, next) => {
  const idCategory = req.params.idCategory; // Assuming the category ID is in the route parameter
  try {
    const products = await Product.find({ idCata: idCategory }).populate({
      path: "productDetails",
      options: { limit: 1 },
      populate: {
        options: { limit: 1 },
        path: "imageProductQuantity",
        populate: {
          path: "imageProduct",
          options: { limit: 1 },
        },
      },
    });
    res.json(products);
  } catch (error) {
    // Handle any errors that occur during the query
    res.status(500).json({ error: "Server error" });
  }
};
const getDetailsProduct = async (req, res, next) => {
  try {
    const idProduct = req.params.idProduct; // Assuming the product ID is in the route parameter
    const product = await Product.findById({ _id: idProduct }).populate({
      path: "productDetails",
      populate: {
        path: "imageProductQuantity",
        populate: {
          path: "imageProduct",
        },
      },
    });

    const favourite = await Favourite.findOne({
      idProduct: idProduct,
      idUser: req.user._id,
    });

    const detailOrder = await DetailOrder.findOne({
      idProduct: idProduct,
      isPay: false,
    });

    const productWithFavourite = {
      ...product.toObject(),
      isFavourite: !!favourite,
      detailOrder: detailOrder || null,
    };
    res.status(200).json(productWithFavourite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    categories.unshift({ _id: "", category: "All" });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getCategories,
  getProducts,
  getProductByIdCate,
  getDetailsProduct,
  getAllFavourites,
  addFavourite,
  deleteFavourite,
  getProductsSale,
  getProductsNew,
  addProduct,
  addDetailsProduct,
  addImageProduct,
  getImageProduct,
  addProductQuantity,
  updateProduct
};
