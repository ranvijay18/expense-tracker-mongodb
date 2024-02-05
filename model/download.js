const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const downloadSchema = new Schema({
    fileUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
})

module.exports = mongoose.model('Download', downloadSchema);


// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Download = sequelize.define('download' , {
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     fileUrl: {
//         type: Sequelize.TEXT,
//         allowNull: false
//     }
// })


// module.exports = Download;