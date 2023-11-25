const express = require("express");
const router = express.Router();
const OrderControler = require("../controler/OrderControler");


router.route("/purchase").put(OrderControler.updatePayment)
const passport = require("passport");
const passportConfig = require("../middelwares/passport.js");
 router.use(passport.authenticate("jwt", { session: false }));
router
  .route("/detail-order")
  .get(OrderControler.getDetailsOrders)
  .post(OrderControler.processDetailsOrder)
  .put(OrderControler.updateDetailOrders)
  .delete(OrderControler.deleteOrderDetails);
router.route("/detail-order/selectAll").put( OrderControler.selectedAll);

router
  .route("/count/orderDetails-notification")
  .get(OrderControler.getCountNotiAndOrderDetails);

  router.route("/").get(OrderControler.getOrderByStatus)
 router.route("/purchase").post(OrderControler.purchase)
  router
  .route("/checkBuyNow")
  .post(OrderControler.checkBuyNow) 
 module.exports = router;
