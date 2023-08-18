'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../mongoose'
import Thread from '../models/Thread'
import User from '../models/User'
import Community from '../models/Community'

export const getAllThreads = async (page: number = 1, limit: number = 20) => {
    try {
        await connectDB()

        const skipAmount = (page - 1) * limit
        const topLevelThreads = await Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({
                createdAt: -1
            })
            .skip(skipAmount)
            .limit(limit)
            .populate([
                'author',
                'community',
                {
                    path: 'children',
                    populate: {
                        path: 'author',
                        select: '_id name parentId image'
                    }
                }
            ])

        const totalThreadCount = await Thread.countDocuments({
            parentId: { $in: [null, undefined] }
        })

        const isNext = totalThreadCount > skipAmount + topLevelThreads.length

        return { threads: topLevelThreads, isNext }
    } catch (err: any) {
        throw new Error(`Failed to fetch threads: ${err.message}`)
    }
}

export const getThreadById = async (id: string) => {
    try {
        await connectDB()
        const thread = await Thread.findById(id).populate([
            {
                path: 'author',
                select: '_id id name image'
            },
            {
                path: 'community',
                select: '_id id name image'
            },
            {
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        populate: {
                            path: 'author',
                            select: '_id id name parentId image'
                        }
                    }
                ]
            }
        ])

        return thread
    } catch (err: any) {
        throw new Error(`Failed to fetch thread with id ${id}: ${err.message}`)
    }
}

interface ICreateThreadParams {
    content: string
    authorId: string
    communityId: string | null
    path: string
}
export const createThread = async ({
    content,
    authorId,
    communityId,
    path
}: ICreateThreadParams) => {
    try {
        await connectDB()

        const matchingCommunity = await Community.findOne({ id: communityId })
        const newThread = await Thread.create({
            content,
            author: authorId,
            community: matchingCommunity?._id || null
        })

        await User.findByIdAndUpdate(authorId, {
            $push: { threads: newThread._id }
        })

        if (matchingCommunity) {
            matchingCommunity.threads.push(newThread._id)
            await matchingCommunity.save()
        }

        revalidatePath(path)
    } catch (err: any) {
        throw new Error(`Failed to create thread: ${err.message}`)
    }
}

interface IAddCommentToThreadParams {
    threadId: string
    content: string
    userId: string
    path: string
}
export const addCommentToThread = async ({
    threadId,
    content,
    userId,
    path
}: IAddCommentToThreadParams) => {
    try {
        await connectDB()

        const parentThread = await Thread.findById(threadId)
        if (!parentThread) {
            throw new Error('Thread not found')
        }

        const newThread = await Thread.create({
            content,
            author: userId,
            parentId: threadId
        })

        parentThread.children.push(newThread._id)
        await parentThread.save()

        revalidatePath(path)
    } catch (err: any) {
        throw new Error(`Failed to add comment to thread: ${err.message}`)
    }
}
