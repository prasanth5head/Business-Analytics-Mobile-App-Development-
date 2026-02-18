const mongoose = require('mongoose');

const revenueSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Revenue = mongoose.model('Revenue', revenueSchema);

module.exports = Revenue;
