import mongoose from 'mongoose'

export interface IThread {
    content: string
    author: mongoose.Types.ObjectId
    community?: mongoose.Types.ObjectId
    createdAt: Date
    parentId?: string
    children: mongoose.Types.ObjectId[]
}

const threadSchema = new mongoose.Schema<IThread>({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    parentId: {
        type: String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ]
})

export default mongoose.models.Thread || mongoose.model('Thread', threadSchema)
