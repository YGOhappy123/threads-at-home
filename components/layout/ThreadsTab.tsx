import { redirect } from 'next/navigation'
import { getUserThreads } from '@/lib/actions/user.actions'
import { getCommunityThreads } from '@/lib/actions/community.actions'
import ThreadCard from '../cards/ThreadCard'

interface IProps {
    authUserId: string
    targetId: string
    type: 'User' | 'Community'
}

interface IResult {
    name: string
    image: string
    id: string
    threads: {
        _id: string
        content: string
        parentId: string | null
        author: {
            name: string
            image: string
            id: string
        }
        community: {
            id: string
            name: string
            image: string
        } | null
        createdAt: string
        children: {
            author: {
                image: string
            }
        }[]
    }[]
}

export default async function ThreadsTab({ authUserId, targetId, type }: IProps) {
    const result: IResult =
        type === 'User' ? await getUserThreads(targetId) : await getCommunityThreads(targetId)

    if (!result) redirect('/')

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {result.threads.map((thread) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={authUserId}
                    parentId={thread.parentId}
                    content={thread.content}
                    author={
                        // If type === 'User', display target user's info
                        // ...else display community's members info
                        type === 'User'
                            ? { name: result.name, image: result.image, id: result.id }
                            : {
                                  name: thread.author.name,
                                  image: thread.author.image,
                                  id: thread.author.id
                              }
                    }
                    community={
                        type === 'Community'
                            ? { name: result.name, id: result.id, image: result.image }
                            : null
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    )
}
