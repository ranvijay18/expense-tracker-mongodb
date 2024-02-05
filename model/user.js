const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean
    },
    totalExpenses: {
        type: Number
    }
});

module.exports = mongoose.model('User', userSchema);






// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user' , {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     username: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull : false,
//     },
//     ispremium: Sequelize.BOOLEAN,
//     totalExpenses: Sequelize.INTEGER
// })

// module.exports = User;