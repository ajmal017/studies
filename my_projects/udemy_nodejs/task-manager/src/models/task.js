const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    trim: true,
    default: false
  }
});

module.exports = mongoose.model('Task', taskSchema);