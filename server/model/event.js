const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({

    title :{
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true

    },
    date : {
        type: Date,
        required: true
    },
    createdBy :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

});


module.exports = mongoose.model("event", eventSchema);
