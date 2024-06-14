const mongoose = require('mongoose');
const ProductItem = require("../db/product_item");
const Visitor = require("../db/visitor");
const Order = require("../db/order");

const getOrderData = async () => {
  try {
    const oneYearAgo = new Date(),
      twoYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    twoYearAgo.setFullYear(twoYearAgo.getFullYear() - 2);
    const aggregate = [
      {
        $match: {
          canceled: false,
          ordered: true,
          disputed: false,
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: "null",
          total: { $sum: 1 },
        },
      },
    ];
    const oneYearOrderArray = await ProductItem.aggregate(aggregate);
    const oneYearOrder = oneYearOrderArray[0]?.total || 0;
    aggregate[0] = {
      $match: {
        canceled: false,
        ordered: true,
        disputed: false,
        createdAt: { $gte: twoYearAgo, $lt: oneYearAgo },
      },
    };
    const twoYearOrderArray = await ProductItem.aggregate(aggregate);
    const twoYearOrder = twoYearOrderArray[0]?.total || 0;
    const order = {
      last_year: oneYearOrder,
      two_year: twoYearOrder,
    };
    return order;
  } catch (err) {
    throw err;
  }
};

const getSoldItems = async () => {
  try {
    const oneYearAgo = new Date(),
      twoYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    twoYearAgo.setFullYear(twoYearAgo.getFullYear() - 2);
    const aggregate = [
      {
        $match: {
          canceled: false,
          ordered: true,
          disputed: false,
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: "null",
          total: { $sum: "$quantity" },
        },
      },
    ];
    const oneYearSoldItemsArray = await ProductItem.aggregate(aggregate);
    const oneYearSoldItems = oneYearSoldItemsArray[0]?.total || 0;
    aggregate[0] = {
      $match: {
        canceled: false,
        ordered: true,
        disputed: false,
        createdAt: { $gte: twoYearAgo, $lt: oneYearAgo },
      },
    };
    const twoYearSoldItemsArray = await ProductItem.aggregate(aggregate);
    const twoYearSoldItems = twoYearSoldItemsArray[0]?.total || 0;
    const soldItems = {
      last_year: oneYearSoldItems,
      two_year: twoYearSoldItems,
    };
    return soldItems;
  } catch (err) {
    throw err;
  }
};

const getGrossSale = async () => {
  try {
    const oneYearAgo = new Date(),
      twoYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    twoYearAgo.setFullYear(twoYearAgo.getFullYear() - 2);
    const aggregate = [
      {
        $match: {
          canceled: false,
          ordered: true,
          disputed: false,
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: "null",
          total: { $sum: "$total_price" },
        },
      },
    ];
    const oneYearTotalSaleArray = await ProductItem.aggregate(aggregate);
    const oneYearTotalSale = oneYearTotalSaleArray[0]?.total || 0;
    aggregate[0] = {
      $match: {
        canceled: false,
        ordered: true,
        disputed: false,
        createdAt: { $gte: twoYearAgo, $lt: oneYearAgo },
      },
    };
    const twoYearTotalSaleArray = await ProductItem.aggregate(aggregate);
    const twoYearTotalSale = twoYearTotalSaleArray[0]?.total || 0;
    const totalSale = {
      last_year: oneYearTotalSale,
      two_year: twoYearTotalSale,
    };
    return totalSale;
  } catch (err) {
    throw err;
  }
};

const getTotalShippingCost = async () => {
  try {
    const oneYearAgo = new Date(),
      twoYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    twoYearAgo.setFullYear(twoYearAgo.getFullYear() - 2);
    const aggregate = [
      {
        $match: {
          canceled: false,
          status: "completed",
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: "null",
          total: { $sum: "$shipping" },
        },
      },
    ];
    const oneYearTotalShippingArray = await Order.aggregate(aggregate);
    const oneYearTotalShipping = oneYearTotalShippingArray[0]?.total || 0;
    aggregate[0] = {
      $match: {
        canceled: false,
        status: "completed",
        createdAt: { $gte: twoYearAgo, $lt: oneYearAgo },
      },
    };
    const twoYearTotalShippingArray = await Order.aggregate(aggregate);
    const twoYearTotalShipping = twoYearTotalShippingArray[0]?.total || 0;
    const totalShipping = {
      last_year: oneYearTotalShipping,
      two_year: twoYearTotalShipping,
    };
    return totalShipping;
  } catch (err) {
    throw err;
  }
};

const getTotalWeeklySale = async () => {
  try {
    const oneWeekAgo = new Date(),
      twoWeekAgo = new Date();
    const weekDays = [], week_sales = [];
    for (let i = 0; i < 7; i++) {
      weekDays.unshift({
        start: new Date(),
        end: new Date()
      });
      weekDays[0].start.setDate(oneWeekAgo.getDate() - i);
      weekDays[0].start.setHours(0,0,0,0);
      weekDays[0].end.setDate(oneWeekAgo.getDate() - i);
      if (i !== 0) {
        weekDays[0].end.setHours(23,59,59,999);
      }
    }
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    twoWeekAgo.setDate(twoWeekAgo.getDate() - 14);
    const aggregate = [
      {
        $match: {
          canceled: false,
          ordered: true,
          disputed: false,
          createdAt: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total_price" },
        },
      },
    ];
    const oneYearTotalWeeklySaleArray = await ProductItem.aggregate(aggregate);
    const oneYearTotalWeeklySale = oneYearTotalWeeklySaleArray[0]?.total || 0;
    aggregate[0] = {
      $match: {
        canceled: false,
        ordered: true,
        disputed: false,
        createdAt: { $gte: twoWeekAgo, $lt: oneWeekAgo },
      },
    };
    const twoYearTotalWeeklySaleArray = await ProductItem.aggregate(aggregate);
    const twoYearTotalWeeklySale = twoYearTotalWeeklySaleArray[0]?.total || 0;
    for (let i = 0; i < 7; i++) {
      const sale = await ProductItem.aggregate([
        {
          $match: {
            createdAt: { $gte: weekDays[i].start, $lte: weekDays[i].end},
            canceled: false,
            ordered: true,
            disputed: false
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total_price"}
          }
        }
      ]);
      week_sales.push(sale[0]?.total || 0);
    }
    const totalWeeklySale = {
      last_year: oneYearTotalWeeklySale,
      two_year: twoYearTotalWeeklySale,
      week_sales,
    };
    return totalWeeklySale;
  } catch (err) {
    throw err;
  }
};

const getTotalWeeklyOrder = async () => {
  try {
    const oneWeekAgo = new Date(),
      twoWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    twoWeekAgo.setDate(twoWeekAgo.getDate() - 14);
    const aggregate = [
      {
        $match: {
          canceled: false,
          ordered: true,
          disputed: false,
          createdAt: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ];
    const oneYearTotalWeeklySaleArray = await ProductItem.aggregate(aggregate);
    const oneYearTotalWeeklySale = oneYearTotalWeeklySaleArray[0]?.total || 0;
    aggregate[0] = {
      $match: {
        canceled: false,
        ordered: true,
        disputed: false,
        createdAt: { $gte: twoWeekAgo, $lt: oneWeekAgo },
      },
    };
    const twoYearTotalWeeklySaleArray = await ProductItem.aggregate(aggregate);
    const twoYearTotalWeeklySale = twoYearTotalWeeklySaleArray[0]?.total || 0;
    const totalWeeklySale = {
      last_year: oneYearTotalWeeklySale,
      two_year: twoYearTotalWeeklySale,
    };
    return totalWeeklySale;
  } catch (err) {
    throw err;
  }
};

const getAnalyticsYearly = async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const analytics = [
      { month_name: "Jan", month: 0, sales: 0, expense: 0 },
      { month_name: "Feb", month: 1, sales: 0, expense: 0 },
      { month_name: "Mar", month: 2, sales: 0, expense: 0 },
      { month_name: "Apr", month: 3, sales: 0, expense: 0 },
      { month_name: "May", month: 4, sales: 0, expense: 0 },
      { month_name: "Jun", month: 5, sales: 0, expense: 0 },
      { month_name: "Jul", month: 6, sales: 0, expense: 0 },
      { month_name: "Aug", month: 7, sales: 0, expense: 0 },
      { month_name: "Sep", month: 8, sales: 0, expense: 0 },
      { month_name: "Oct", month: 9, sales: 0, expense: 0 },
      { month_name: "Nov", month: 10, sales: 0, expense: 0 },
      { month_name: "Dec", month: 11, sales: 0, expense: 0 },
    ];
    const currentMonth = new Date().getMonth();
    for (let analytic of analytics) {
      if (analytic.month > currentMonth) {
        break;
      } else {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(analytic.month);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const runningMonth = new Date();
        runningMonth.setMonth(analytic.month);
        const aggregateToSales = [
          {
            $match: {
              canceled: false,
              ordered: true,
              disputed: false,
              createdAt: { $gte: oneMonthAgo, $lt: runningMonth },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total_price" },
            },
          },
        ];
        const aggregateToExpenses = [
          {
            $match: {
              canceled: false,
              createdAt: { $gte: oneMonthAgo, $lt: runningMonth },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$shipping" },
            },
          },
        ];
        const sales = await ProductItem.aggregate(aggregateToSales).session(session);
        const expenses = await Order.aggregate(aggregateToExpenses).session(session);
        analytic.sales = sales[0]?.total || 0;
        analytic.expense = expenses[0]?.total || 0;
      }
    }
    await session.commitTransaction();
    session.endSession();
    return analytics;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getAnalyticsMonthly = async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const analytics = [
      { week_name: "1st", week: 0, sales: 0, expense: 0 },
      { week_name: "2nd", week: 1, sales: 0, expense: 0 },
      { week_name: "3rd", week: 2, sales: 0, expense: 0 },
      { week_name: "4th", week: 3, sales: 0, expense: 0 },
      { week_name: "5th", week: 4, sales: 0, expense: 0 },
    ];
    const currentWeek = Math.floor(((new Date()).getDate() - 1) / 7);
    for (let analytic of analytics) {
      if (analytic.week > currentWeek) {
        break;
      } else {
        const startDate = new Date();
        startDate.setDate((analytic.week * 7) + 1);
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 6);
        const aggregateToSales = [
          {
            $match: {
              canceled: false,
              ordered: true,
              disputed: false,
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total_price" },
            },
          },
        ];
        const aggregateToExpenses = [
          {
            $match: {
              canceled: false,
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$shipping" },
            },
          },
        ];
        const sales = await ProductItem.aggregate(aggregateToSales).session(session);
        const expenses = await Order.aggregate(aggregateToExpenses).session(session);
        analytic.sales = sales[0]?.total || 0;
        analytic.expense = expenses[0]?.total || 0;
      }
    }
    await session.commitTransaction();
    session.endSession();
    return analytics;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const todaysTotalSale = async () => {
  try {
    const aggregate = [
      {
        $match: {
          createdAt: new Date(),
          status: 'delivered',
          canceled: false,
          ordered: true,
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total_price'}
        }
      }
    ];
    const todays_sale = await ProductItem.aggregate(aggregate);
    const sale = todays_sale[0]?.total || 0;
    return sale;
  } catch (err) {
    throw err;
  }
};

const getVisitors = async () => {
  try {
    const totalVisits = await Visitor.findById("65f81b4e104dfe40f15a9688").lean();
     return totalVisits.count;
  } catch (err) {
    throw err;
  }
};



module.exports = {
  getOrderData,
  getSoldItems,
  getGrossSale,
  getTotalShippingCost,
  getTotalWeeklySale,
  getTotalWeeklyOrder,
  getAnalyticsYearly,
  getAnalyticsMonthly,
  todaysTotalSale,
  getVisitors,
};
