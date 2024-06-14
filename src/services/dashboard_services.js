const { userType } = require("../utils/enums");
const Visitor = require("../db/visitor");
const Dashboard = require("../db/dashboard");
const {
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
} = require("../common/manage_dashboard_data");

// * Function to create a dashboard
const createDashboard = async (req, res) => {
  try {
    if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You have to be admin" });
    } else {
      const dashboardObj = {};
      for (let item in req?.body) {
        dashboardObj[item] = req?.body[item];
      }
      const dashboardCollection = await new Dashboard(dashboardObj);
      const dashboard = await dashboardCollection.save();
      if (dashboard) {
        res.status(200).json({ dashboard });
      } else {
        res.status(400).json({ message: "Dashboard not created" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all dashboards
const getAllDashboards = async (req, res) => {
  try {
    if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You have to be admin" });
    } else {
      const dashboards = await Dashboard.find({});
      if (dashboards) {
        res.status(200).json({ dashboards });
      } else {
        res.status(404).json({ message: "Dashboard not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get dashboard by ID
const getDashboardById = async (req, res) => {
  try {
    if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You have to be admin" });
    } else {
      const id = req?.params?.id;
      if (!id) {
        res.status(400).json({ message: "ID is required" });
      } else {
        const dashboard = await Dashboard.findById(id);
        if (dashboard) {
          res.status(200).json({ dashboard });
        } else {
          res.status(404).json({ message: "Dashboard not found" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update dashboard by ID
const updateDashboardById = async (req, res) => {
  try {
    if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You have to be admin" });
    } else {
      const id = req?.params?.id;
      if (!id) {
        res.status(400).json({ message: "ID is required" });
      } else {
        const oldDashboard = await Dashboard.findById(id).lean();
        for (let item in req?.body) {
          oldDashboard[item] = req?.body[item];
        }
        const dashboard = await Dashboard.findByIdAndUpdate(id, oldDashboard, {
          new: true,
        });
        if (dashboard) {
          res.status(200).json({ dashboard });
        } else {
          res.status(404).json({ message: "Dashboard not found" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete dashboard by ID
const deleteDashboardById = async (req, res) => {
  try {
    if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You have to be admin" });
    } else {
      const id = req?.params?.id;
      if (!id) {
        res.status(400).json({ message: "ID is required" });
      } else {
        const dashboard = await Dashboard.findByIdAndDelete(id);
        if (dashboard) {
          res.status(200).json({ message: "Dashboard deleted successfully" });
        } else {
          res.status(404).json({ message: "Dashboard not found" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to provide dashboard data
const provideDashboardData = async (req, res) => {
  try {
    if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You have to be an admin" });
    } else {
      const visitors = await getVisitors();
      const order = await getOrderData();
      const sold_items = await getSoldItems();
      const gross_sales = await getGrossSale();
      const total_shipping_cost = await getTotalShippingCost();
      const total_weekly_sale = await getTotalWeeklySale();
      const total_weekly_order = await getTotalWeeklyOrder();
      const todays_total_sale = await todaysTotalSale();
      const dashboardData = {
        visitors,
        order,
        sold_items,
        gross_sales,
        total_shipping_cost,
        total_weekly_sale,
        total_weekly_order,
        todays_total_sale,
      };
      res.status(200).json({ dashboard_data: dashboardData });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Functiion to provide analytics
const provideAnalytics = async (req, res) => {
  try {
    if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You have to be an admin" });
    } else {
      const analytics_yearly = await getAnalyticsYearly();
      const analytics_monthly = await getAnalyticsMonthly();
      res.status(200).json({ analytics_yearly, analytics_monthly });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to add visitor
const addVisitor = async (req, res) => {
  try {
    const count = await Visitor.findByIdAndUpdate(
      "65f81b4e104dfe40f15a9688",
      { $inc: { count: 1 } },
      { new: true }
    );
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createDashboard,
  getAllDashboards,
  getDashboardById,
  updateDashboardById,
  deleteDashboardById,
  provideDashboardData,
  provideAnalytics,
  addVisitor,
};
