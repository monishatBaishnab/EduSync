const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
    explanation: {
        type: String,
        required: true
    },
    referenceLinks: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: "pending"
    },
    submissionDate: {
        type: Date,
        default: Date.now,
    },
    solver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignments'
    }
})

const Soluction = mongoose.model('Solution', solutionSchema);
module.exports = Soluction;