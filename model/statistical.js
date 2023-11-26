const mongoose = require("mongoose");
const staticRevenueScheme = new mongoose.Schema({
  price: Number,
  createdAt: { type: Date, default: Date.now },

});
 const staticRevenue = mongoose.model("staticRevenue", staticRevenueScheme);
module.exports = staticRevenue;



const staticUserSchema = new mongoose.Schema({
  username: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
});

const staticUser = mongoose.model('staticUser', staticUserSchema);
module.exports = staticUser;