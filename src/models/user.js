import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [32, 'Username must be at most 32 characters'],
        trim: true,
        match: [
            /^[a-zA-Z0-9]+$/,
            'Username must contain only letters and numbers'
        ]
    },
    avatar: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        index: true
    },
    verificationTokenExpiry: {
        type: Date
    },
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true, transform: (_doc, ret) => { delete ret.password; return ret; } } });

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

userSchema.pre('save', async function handleUserPreSave(next) {
    try {
        if (this.isNew) {
            if (this.isModified('password')) {
                const salt = await bcrypt.genSalt(SALT_ROUNDS);
                this.password = await bcrypt.hash(this.password, salt);
            }
            this.avatar = this.avatar || `https://robohash.org/${this.username}`;
            this.verificationToken = uuidv4().substring(0, 10).toUpperCase();
            this.verificationTokenExpiry = new Date(Date.now() + 3600000);
        } else if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(SALT_ROUNDS);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;