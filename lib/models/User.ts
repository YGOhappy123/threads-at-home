import mongoose from 'mongoose'

interface IUser {
    id: string
    username: string
    name: string
    image?: string
    bio?: string
    threads: mongoose.Types.ObjectId[]
    onboarded: boolean
    communities: mongoose.Types.ObjectId[]
}

const userSchema = new mongoose.Schema<IUser>({
    id: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    image: String,
    bio: String,
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    onboarded: {
        type: Boolean,
        default: false
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        }
    ]
})

export default mongoose.models.User || mongoose.model('User', userSchema)
