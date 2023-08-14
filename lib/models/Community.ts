import mongoose from 'mongoose'

interface ICommunity {
    id: string
    username: string
    name: string
    image?: string
    bio?: string
    createdBy: mongoose.Types.ObjectId
    threads: mongoose.Types.ObjectId[]
    members: mongoose.Types.ObjectId[]
}

const communitySchema = new mongoose.Schema<ICommunity>({
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

export default mongoose.models.Community || mongoose.model('Community', communitySchema)
