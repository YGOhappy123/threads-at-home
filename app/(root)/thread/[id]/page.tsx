import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { getUserData } from '@/lib/actions/user.actions'
import { getThreadById } from '@/lib/actions/thread.actions'
import ThreadCard from '@/components/cards/ThreadCard'
import CommentForm from '@/components/form/CommentForm'

interface IProps {
    params: { id: string }
}

export default async function ThreadDetailPage({ params: { id } }: IProps) {
    if (!id) return null

    const user = await currentUser()
    if (!user) return null

    const userData = await getUserData(user.id)
    if (!userData?.onboarded) redirect('/onboarding')

    const thread = await getThreadById(id)

    return (
        <section className='relative'>
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user.id}
                    parentId={thread.parentId}
                    content={thread.content}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>

            <div className='mt-7'>
                <CommentForm
                    threadId={id}
                    currentUserId={userData._id}
                    currentUserImg={userData.image}
                />
            </div>

            <div className='mt-10'>
                {thread.children.map((comment: any) => (
                    <ThreadCard
                        key={comment._id}
                        id={comment._id}
                        currentUserId={user.id}
                        parentId={comment.parentId}
                        content={comment.content}
                        author={comment.author}
                        community={comment.community}
                        createdAt={comment.createdAt}
                        comments={comment.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}
