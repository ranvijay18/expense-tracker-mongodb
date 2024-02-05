const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const forgetSchema = new Schema({
    forget_id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
})

module.exports = mongoose.model('Forget', forgetSchema);



// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Forget = sequelize.define('ForgetPasswordRequest', {
//     id: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         primaryKey: true
//     },
//     isActive: {
//         type: Sequelize.BOOLEAN,
//     }
// })

// module.exports = Forget;