'use server'

import { FilterQuery, SortOrder, Types } from 'mongoose'
import { connectDB } from '../mongoose'
import Community from '../models/Community'
import Thread from '../models/Thread'
import User from '../models/User'

export const createCommunity = async (
    id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    creatorId: string
) => {
    try {
        await connectDB()

        const creator = await User.findOne({ id: creatorId })
        if (!creator) {
            throw new Error('User not found')
        }

        const newCommunity = await Community.create({
            id,
            name,
            username,
            image,
            bio,
            createdBy: creator._id
        })

        creator.communities.push(newCommunity._id)
        await creator.save()

        return newCommunity
    } catch (err: any) {
        throw new Error(`Error creating community: ${err.message}`)
    }
}

export const getCommunityDetails = async (communityId: string) => {
    try {
        await connectDB()

        const communityDetails = await Community.findOne({ id: communityId }).populate([
            'createdBy',
            {
                path: 'members',
                select: 'name username image _id id'
            }
        ])

        return communityDetails
    } catch (err: any) {
        throw new Error(`Error fetching community details: ${err.message}`)
    }
}

export const getCommunityThreads = async (communityId: string) => {
    try {
        await connectDB()

        const communityPosts = await Community.findOne({ id: communityId }).populate({
            path: 'threads',
            populate: [
                {
                    path: 'author',
                    select: 'name image id'
                },
                {
                    path: 'children',
                    populate: {
                        path: 'author',
                        select: 'image _id'
                    }
                }
            ]
        })

        return communityPosts
    } catch (err: any) {
        throw new Error(`Error fetching community threads: ${err.message}`)
    }
}

interface ISearchCommunitiesParams {
    searchTerm?: string
    page?: number
    limit?: number
    sortBy?: SortOrder
}
export const fetchCommunities = async ({
    searchTerm = '',
    page = 1,
    limit = 20,
    sortBy = 'desc'
}: ISearchCommunitiesParams) => {
    try {
        await connectDB()

        const skipAmount = (page - 1) * limit
        const communityQuery: FilterQuery<typeof Community> = {}

        // Optimize for bigger data finding process
        const isSearchTermNotEmpty = searchTerm.trim() !== ''
        if (isSearchTermNotEmpty) {
            const regExp = new RegExp(searchTerm.trim(), 'i')
            if (communityQuery.$or?.length) {
                communityQuery.$or.push(
                    { username: { $regex: regExp } },
                    { name: { $regex: regExp } }
                )
            } else {
                communityQuery.$or = [
                    { username: { $regex: regExp } },
                    { name: { $regex: regExp } }
                ]
            }
        }

        const communitiesData = await Community.find(communityQuery)
            .sort({ createdAt: sortBy })
            .skip(skipAmount)
            .limit(limit)
            .populate('members')

        const communitiesCount = await Community.countDocuments(communityQuery)
        const isNext = communitiesCount > skipAmount + communitiesData.length

        return { communities: communitiesData, isNext }
    } catch (err: any) {
        throw new Error(`Error fetching communities: ${err.message}`)
    }
}

export const addMemberToCommunity = async (communityId: string, memberId: string) => {
    try {
        await connectDB()

        const community = await Community.findOne({ id: communityId })
        if (!community) {
            throw new Error('Community not found')
        }

        const user = await User.findOne({ id: memberId })
        if (!user) {
            throw new Error('User not found')
        }

        if (community.members.some((memberId: Types.ObjectId) => memberId.equals(user._id))) {
            throw new Error('User is already a member of the community')
        }

        community.members.push(user._id)
        await community.save()

        user.communities.push(community._id)
        await user.save()

        return community
    } catch (err: any) {
        throw new Error(`Error adding member to community: ${err.message}`)
    }
}

export const removeUserFromCommunity = async (userId: string, communityId: string) => {
    try {
        await connectDB()

        const userIdObject = await User.findOne({ id: userId }, { _id: 1 })
        if (!userIdObject) {
            throw new Error('User not found')
        }

        const communityIdObject = await Community.findOne({ id: communityId }, { _id: 1 })
        if (!communityIdObject) {
            throw new Error('Community not found')
        }

        await Community.updateOne(
            { _id: communityIdObject._id },
            { $pull: { members: userIdObject._id } }
        )

        await User.updateOne(
            { _id: userIdObject._id },
            { $pull: { communities: communityIdObject._id } }
        )

        return { success: true }
    } catch (err: any) {
        throw new Error(`Error removing user from community: ${err.message}`)
    }
}

export const updateCommunityInfo = async (
    communityId: string,
    name: string,
    username: string,
    image: string
) => {
    try {
        await connectDB()

        const updatedCommunity = await Community.findOneAndUpdate(
            { id: communityId },
            { name, username, image }
        )

        if (!updatedCommunity) {
            throw new Error('Community not found')
        }

        return updatedCommunity
    } catch (err: any) {
        throw new Error(`Error updating community information: ${err.message}`)
    }
}

export const deleteCommunity = async (communityId: string) => {
    try {
        await connectDB()

        const deletedCommunity = await Community.findOneAndDelete({
            id: communityId
        })

        if (!deletedCommunity) {
            throw new Error('Community not found')
        }

        // Delete all threads associated with the community
        await Thread.deleteMany({ community: communityId })

        // Find all users who are part of the community and remove this community from their list
        const communityUsers = await User.find({ communities: communityId })
        const updateUserPromises = communityUsers.map((user) => {
            user.communities = [...user.communities].filter((id) => id !== communityId)
            return user.save()
        })
        await Promise.all(updateUserPromises)

        return deletedCommunity
    } catch (err: any) {
        throw new Error(`Error deleting community: ${err.message}`)
    }
}
