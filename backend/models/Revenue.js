const mongoose = require('mongoose');

const revenueSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    isDeleted: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexing for faster queries
revenueSchema.index({ userId: 1, month: 1 });
revenueSchema.index({ product: 1 });

// Post-save hook for pre-aggregation
revenueSchema.post('save', async function (doc) {
    const MonthlyStats = mongoose.model('MonthlyStats');
    await MonthlyStats.findOneAndUpdate(
        { userId: doc.userId, month: doc.month },
        {
            $inc: {
                totalSales: doc.amount,
                totalProfit: doc.profit,
                totalLoss: doc.loss,
                count: 1
            }
        },
        { upsert: true, new: true }
    );
});

// Post-delete hook for pre-aggregation consistency
revenueSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const MonthlyStats = mongoose.model('MonthlyStats');
        await MonthlyStats.findOneAndUpdate(
            { userId: doc.userId, month: doc.month },
            {
                $inc: {
                    totalSales: -doc.amount,
                    totalProfit: -doc.profit,
                    totalLoss: -doc.loss,
                    count: -1
                }
            }
        );
    }
});

const Revenue = mongoose.model('Revenue', revenueSchema);

module.exports = Revenue;
