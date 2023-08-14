import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
    mongoose.set('strictQuery', true)

    if (!process.env.DATABASE_URI) {
        return console.log('Missing database URI')
    }

    if (isConnected) {
        return console.log('Database connection already established')
    }

    try {
        await mongoose.connect(process.env.DATABASE_URI)

        isConnected = true
        console.log('Connected to database')
    } catch (err) {
        console.log(err || 'Error connecting to database')
    }
}
