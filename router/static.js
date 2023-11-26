const express = require('express')
const router = express.Router()
const StaticControler =  require('../controler/StaticControler')

router.route("/revenue").get(StaticControler.getReveNue).post(StaticControler.postReveNue);
router.route("/user").get(StaticControler.getUser).post(StaticControler.postUser);

module.exports = router;