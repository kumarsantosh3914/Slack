import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Workspace name is required'],
        unique: true,
        trim: true,
        minlength: [2, 'Workspace name must be at least 2 characters'],
        maxlength: [64, 'Workspace name must be at most 64 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1024, 'Description too long'],
        default: ''
    },
    members: [
        {
            memberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                index: true
            },
            role: {
                type: String,
                enum: ['admin', 'member'],
                default: 'member'
            }
        }
    ],
    joinCode: {
        type: String,
        required: [true, 'Join code is required'],
        unique: true,
        index: true
    },
    channels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ]
}, { timestamps: true, versionKey: false });

workspaceSchema.index({ name: 1 }, { unique: true });
workspaceSchema.index({ 'members.memberId': 1 });

const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;