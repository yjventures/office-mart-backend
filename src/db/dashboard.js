const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema(
    {
        visits: {
            type: Number,
            default: 0
        },
        sales: {
            type: Number,
            default: 0
        },
        orders: {
            type: Number,
            default: 0
        },
        sold_items: {
            type: Number,
            default: 0
        },
        shiping_costs: {
            type: Number,
            default: 0
        },
    }, {
        timestamps: true
    }
);

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
module.exports = Dashboard;
