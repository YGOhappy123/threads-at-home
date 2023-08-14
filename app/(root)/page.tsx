import { getAllThreads } from '@/lib/actions/thread.actions'
import { currentUser } from '@clerk/nextjs'
import ThreadCard from '@/components/cards/ThreadCard'

export default async function HomePage() {
    const { threads, isNext } = await getAllThreads()
    const user = await currentUser()
    if (!user) return null

    return (
        <>
            <h1 className='head-text text-left mb-10'>Home</h1>
            <section className='flex flex-col gap-10'>
                {threads.length === 0 ? (
                    <p className='no-result'>No threads found</p>
                ) : (
                    <>
                        {threads.map((thread) => (
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
                        ))}
                    </>
                )}
            </section>
        </>
    )
}
