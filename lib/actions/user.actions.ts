'use server'

import { revalidatePath } from 'next/cache'
import { FilterQuery, SortOrder } from 'mongoose'
import { connectDB } from '../mongoose'
import User from '../models/User'
import Thread, { IThread } from '../models/Thread'

export const getUserData = async (userId: string) => {
    try {
        await connectDB()
        return await User.findOne({ id: userId })
        // Find by clerk id, more convenient working with current auth status
    } catch (err: any) {
        throw new Error(`Failed to fetch user: ${err.message}`)
    }
}

export const getUserThreads = async (userId: string) => {
    try {
        await connectDB()
        const userWithThreads = await User.findOne({ id: userId }).populate({
            path: 'threads',
            populate: [
                // {
                //     path: 'community',
                //     select: 'name id image _id'
                // },
                {
                    path: 'children',
                    populate: {
                        path: 'author',
                        select: 'name image id'
                    }
                }
            ]
        })
        return userWithThreads
        // Detailed top-level threads authored by user
    } catch (err: any) {
        throw new Error(`Failed to fetch user's threads: ${err.message}`)
    }
}

export const getUserActivities = async (userId: string) => {
    try {
        await connectDB()

        // Build a notification system for replies to user's threads and comments
        const allThreadsAndComments = await Thread.find({ author: userId })
        const repliesIDs = allThreadsAndComments.reduce(
            (idArray, thread: IThread) => idArray.concat(thread.children),
            []
        )

        const replies = await Thread.find({
            _id: { $in: repliesIDs },
            author: { $ne: userId } // Exclude replies authored by the same user
        }).populate({
            path: 'author',
            select: 'name image _id'
        })

        return replies
    } catch (err: any) {
        throw new Error(`Failed to get activities: ${err.message}`)
    }
}

interface ISearchUsersParams {
    userId: string
    searchTerm?: string
    page?: number
    limit?: number
    sortBy?: SortOrder
}
export const fetchUsers = async ({
    userId,
    searchTerm = '',
    page = 1,
    limit = 20,
    sortBy = 'desc'
}: ISearchUsersParams) => {
    try {
        await connectDB()

        const skipAmount = (page - 1) * limit
        const userQuery: FilterQuery<typeof User> = {
            id: { $ne: userId } // Exclude the current user from the results
        }

        // Optimize for bigger data finding process
        const isSearchTermNotEmpty = searchTerm.trim() !== ''
        if (isSearchTermNotEmpty) {
            const regExp = new RegExp(searchTerm.trim(), 'i')
            if (userQuery.$or?.length) {
                userQuery.$or.push({ username: { $regex: regExp } }, { name: { $regex: regExp } })
            } else {
                userQuery.$or = [{ username: { $regex: regExp } }, { name: { $regex: regExp } }]
            }
        }

        const usersData = await User.find(userQuery)
            .sort({ createdAt: sortBy })
            .skip(skipAmount)
            .limit(limit)

        const usersCount = await User.countDocuments(userQuery)
        const isNext = usersCount > skipAmount + usersData.length

        return { users: usersData, isNext }
    } catch (err: any) {
        throw new Error(`Failed to fetch users: ${err.message}`)
    }
}

interface IUpdateUserParams {
    userId: string
    username: string
    name: string
    bio: string
    image: string
    path: string
}
export const updateUser = async ({
    userId,
    bio,
    name,
    path,
    username,
    image
}: IUpdateUserParams): Promise<void> => {
    try {
        await connectDB()
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        )

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (err: any) {
        throw new Error(`Failed to create/update user: ${err.message}`)
    }
}
