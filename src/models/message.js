import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Message body is required'],
        trim: true,
        maxlength: [5000, 'Message body too long']
    },
    image: {
        type: String,
        validate: {
            validator: (v) => !v || /^https?:\/\//i.test(v),
            message: 'Image must be a valid URL'
        },
        default: null
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: [true, 'Channel ID is required'],
        index: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender ID is required'],
        index: true
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: [true, 'Workspace ID is required'],
        index: true
    }
}, { timestamps: true, versionKey: false });

messageSchema.index({ workspaceId: 1, channelId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;