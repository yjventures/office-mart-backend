const mongoose = require('mongoose');

const supportTicketSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    dispute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dispute',
      default: null
    },
    images: {
      type: [
        {
          type: String,
        }
      ],
      default: [],
    },
    tags: {
      type: [
        {
          type: String,
        }
      ],
      default: []
    },
    connection: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
    detail: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'open',
      enum: ['open', 'closed', 'resolved']
    }
  }, {
    timestamps: true
  }
);

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
module.exports = SupportTicket;