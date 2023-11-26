const mongoose = require("mongoose");
const Static = require('../model/statistical');
const staticUser = require('../model/statistical');
const moment = require('moment');

const getReveNue = async (req, res) => {
    try {
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();
    
        const result = await Static.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$price' },
            },
          },
        ]);
    
        res.json({ totalRevenue: result.length > 0 ? result[0].totalRevenue : 0 });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

const postReveNue = async (req, res) => {
    try {
        const { price } = req.body;

        console.log("price : "+price);
    
        // Kiểm tra xem amount có tồn tại và là số không
        if (!price || isNaN(price)) {
          return res.status(400).json({ error: 'Invalid amount. Please provide a valid numeric amount.' });
        }
    
        const sale = new Static({ price });
        await sale.save();
    
        res.json({ success: true, sale });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

const getUser = async(req,res)=>{
    try {
        const startOfDay = moment().startOf('day').toDate();
        const endOfDay = moment().endOf('day').toDate();
    
        const result = await staticUser.countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        });
    
        res.json({ newSignups: result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

};
const postUser = async(req,res)=>{
    try {
        const { username, email } = req.body;
    
        if (!username || !email) {
          return res.status(400).json({ error: 'Username and email are required.' });
        }
    
        const user = new staticUser({ username, email });
        await user.save();
    
        res.json({ success: true, user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports = { getReveNue, postReveNue,getUser,postUser };