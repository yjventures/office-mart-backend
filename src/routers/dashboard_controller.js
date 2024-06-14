const express = require("express");
const { dashboardAPI } = require("../utils/api_constant");
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createDashboard,
  getAllDashboards,
  getDashboardById,
  updateDashboardById,
  deleteDashboardById,
  provideDashboardData,
  provideAnalytics,
  addVisitor,
} = require("../services/dashboard_services");

const router = express.Router();

// ? API to craete a dashboard
router.post(dashboardAPI.CREATE, authenticateToken, createDashboard);

// ? API to get all dashboards
router.get(dashboardAPI.GET_ALL, authenticateToken, getAllDashboards);

// ? API to get a dashboard by id
router.get(dashboardAPI.GET_BY_ID, authenticateToken, getDashboardById);

// ? API to update a dashboard by id
router.put(dashboardAPI.UPDATE_BY_ID, authenticateToken, updateDashboardById);

// ? API to delete a dashboard by id
router.delete(dashboardAPI.DELETE_BY_ID, authenticateToken, deleteDashboardById);

// ? API to provide dashboard data
router.get(dashboardAPI.PROVIDE_DATA, authenticateToken,  provideDashboardData);

// ? API to provide analytics
router.get(dashboardAPI.ANALYTICS, authenticateToken, provideAnalytics);

// ? API to provide add visitor
router.post(dashboardAPI.ADD_VISITOR, addVisitor);

module.exports = router;

