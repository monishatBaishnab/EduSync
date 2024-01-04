const mongoose = require('mongoose');

const assignmentModel = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  maxMark: {
    type: Number,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Assignment = mongoose.model('Assignment', assignmentModel);
module.exports = Assignment;