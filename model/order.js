const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    payment_id: {
        type: String
    },
    order_id: {
        type:String
    },
    status: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
})

module.exports = mongoose.model('Order', orderSchema);


// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     payment_id: Sequelize.STRING,
//     order_id : Sequelize.STRING,
//     status : Sequelize.STRING,
    
// })

// module.exports = Order;