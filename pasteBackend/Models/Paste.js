import mongoose from 'mongoose';

const pasteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    access: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
    },
    contentType: {
        type: String,
        enum: ['code', 'text', 'json'],
        required: true,
    },
    expirationDate: {
        type: Date,  
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Paste = mongoose.model('Paste', pasteSchema);

export default Paste;