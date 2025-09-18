import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Channel name is required'],
        trim: true,
        minlength: [2, 'Channel name must be at least 2 characters'],
        maxlength: [64, 'Channel name must be at most 64 characters']
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: [true, 'Workspace ID is required'],
        index: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    topic: {
        type: String,
        trim: true,
        maxlength: [256, 'Topic cannot exceed 256 characters'],
        default: ''
    }
}, { timestamps: true, versionKey: false });

channelSchema.index({ workspaceId: 1, name: 1 }, { unique: true });

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;