const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    accessToken: {
      type: String
    },
    licenseKey: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = User = mongoose.model('users', UserSchema);
