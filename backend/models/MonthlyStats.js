const mongoose = require('mongoose');

const monthlyStatsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String,
        required: true
    },
    totalSales: {
        type: Number,
        default: 0
    },
    totalProfit: {
        type: Number,
        default: 0
    },
    totalLoss: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index for O(1) lookups per user and month
monthlyStatsSchema.index({ userId: 1, month: 1 }, { unique: true });

const MonthlyStats = mongoose.model('MonthlyStats', monthlyStatsSchema);

module.exports = MonthlyStats;
