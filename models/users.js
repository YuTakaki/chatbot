const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    _id : {
        type : String,
        required : true
    },
    interest : [{type : String}],
    connectedTo : {
        type : String,
        default : null
    },
    ready : {
        type : Boolean,
        default : false
    }
})

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;