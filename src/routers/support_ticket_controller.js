const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { supportTicketAPI } = require("../utils/api_constant");
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createSupportTicket,
  getSupportTicket,
  getSupportTicketByID,
  updateSupportTicketbyID,
  deleteSupportTicketByID,
} = require("../services/support_ticket_services");

// ? API to create support ticket
router.post(supportTicketAPI.CREATE, authenticateToken, createSupportTicket);

// ? API to get all support ticket
router.get(supportTicketAPI.GET_ALL, authenticateToken, getSupportTicket);

// ? API to get a support ticket by ID
router.get(supportTicketAPI.GET_BY_ID, authenticateToken, getSupportTicketByID);

// ? API to Update a support ticket by ID
router.put(supportTicketAPI.UPDATE_BY_ID, authenticateToken, updateSupportTicketbyID);

// ? API to Delete a support ticket by ID
router.delete(supportTicketAPI.DELETE_BY_ID, authenticateToken, deleteSupportTicketByID);

module.exports = router;