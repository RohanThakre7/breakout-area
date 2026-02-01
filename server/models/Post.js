const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: function () { return !this.images || this.images.length === 0 },
        trim: true,
        maxlength: 2000
    },
    images: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentsCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Index for search
postSchema.index({ text: 'text' });

module.exports = mongoose.model('Post', postSchema);
