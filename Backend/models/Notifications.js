const mongoose = require("mongoose");

const NotificationsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      default: "./admin.jpeg",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notifications = mongoose.model("Notifications", NotificationsSchema);

module.exports = Notifications;
