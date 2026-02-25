const mongoose = require('mongoose');

const revenueSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    product: {
        type: String,
        default: 'All'
    },
    profit: {
        type: Number,
        default: 0
    },
    loss: {
        type: Number,
        default: 0
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
