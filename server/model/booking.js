const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, 
{timestamps: true}
);


module.exports = mongoose.model('booking', bookingSchema);