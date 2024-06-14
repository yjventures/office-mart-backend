const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const SupportTicket = require("../db/support_ticket");
const User = require("../db/user");
require("dotenv").config();

// * Helper functions to create support ticket
const createTicket = async (body, session = false) => {
  let newSession = null;
  if (!session) {
    newSession = await mongoose.startSession();
    newSession.startTransaction();
  }
  try {
    const ticketObj = {};
    for (let item in body) {
      ticketObj[item] = body[item];
    }
    const user = await User.findById(body?.user_id).lean();
    const ticketId = await fetch(process.env.OS_TICKET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.X_API_KEY,
      },
      body: JSON.stringify({
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        subject: body?.caption,
        message: body?.detail,
      }),
    });
    ticketObj.connection = await ticketId.json();
    const ticketCollection = await new SupportTicket(ticketObj);
    let ticket = null;
    if (session) {
      ticket = await ticketCollection.save({ session });
    } else {
      ticket = await ticketCollection.save({ session: newSession });
      await newSession.commitTransaction();
      newSession.endSession();
    }
    return ticket;
  } catch (err) {
    if (!session) {
      await newSession.abortTransaction();
      newSession.endSession();
    }
    throw err;
  }
};

// * Function to create support ticket
const createSupportTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const ticket = await createTicket(req?.body);
      if (ticket) {
        res.status(200).json({ support_ticket: ticket });
      } else {
        res.status(400).json({ message: "Support ticket not created." });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all support ticket using querystring
const getSupportTicket = async (req, res) => {
  try {
    const query = {};
    let limit = 10,
      page = 1;
    let sortBy = "createdAt";
    for (let item in req?.query) {
      if (item === "page" || item === "limit") {
        const num = Number(req?.query[item]);
        if (!isNaN(num)) {
          if (item === "page") {
            page = num;
          } else {
            limit = num;
          }
        }
      } else if (item === "sortBy") {
        sortBy = req?.query[item];
      } else {
        query[item] = req.query[item];
      }
    }
    const tickets = await SupportTicket.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await SupportTicket.countDocuments(query);
    if (tickets) {
      res.status(200).json({ support_tickets: tickets, total });
    } else {
      res.status(404).json({ message: "No tickets found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a support ticket by ID
const getSupportTicketByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const ticket = await SupportTicket.findById(id);
    if (ticket) {
      res.status(200).json({ support_ticket: ticket });
    } else {
      res.status(404).json({ message: "Support Ticket Not Found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update support ticket by ID
const updateSupportTicketbyID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const ticket = await SupportTicket.findById(id).lean();
    if (ticket) {
      for (let item in req?.body) {
        ticket[item] = req?.body[item];
      }
      const updatedTicket = await SupportTicket.findByIdAndUpdate(id, ticket, {
        new: true,
      });
      if (updatedTicket) {
        res.status(200).json({ support_ticket: updatedTicket });
      } else {
        res.status(400).json({ message: "Support Ticket Not Updated" });
      }
    } else {
      res.status(404).json({ message: "Support Ticket Not Found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete support ticket by ID
const deleteSupportTicketByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const ticket = await SupportTicket.findById(id);
    if (ticket) {
      const deletedTicket = await SupportTicket.findByIdAndDelete(id);
      if (deletedTicket) {
        res
          .status(200)
          .json({ message: "Support ticket deleted successfully" });
      } else {
        res.status(400).json({ message: "Support ticket not deleted." });
      }
      res.status(200).json({ support_ticket: ticket });
    } else {
      res.status(404).json({ message: "Support Ticket Not Found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createTicket,
  createSupportTicket,
  getSupportTicket,
  getSupportTicketByID,
  updateSupportTicketbyID,
  deleteSupportTicketByID,
};
