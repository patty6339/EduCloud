const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    },
    progress: {
        completedLessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        }],
        lastAccessed: {
            type: Date
        },
        percentageCompleted: {
            type: Number,
            default: 0
        }
    },
    certificate: {
        issued: {
            type: Boolean,
            default: false
        },
        issueDate: {
            type: Date
        },
        certificateUrl: {
            type: String
        }
    },
    rating: {
        score: {
            type: Number,
            min: 1,
            max: 5
        },
        review: {
            type: String
        },
        date: {
            type: Date
        }
    }
}, {
    timestamps: true
});

// Ensure unique enrollment
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
