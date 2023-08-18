import { getAllThreads } from '@/lib/actions/thread.actions'
import { currentUser } from '@clerk/nextjs'
import ThreadCard from '@/components/cards/ThreadCard'
import Pagination from '@/components/layout/Pagination'

interface IProps {
    searchParams: { [key: string]: string | undefined }
}

export default async function HomePage({ searchParams }: IProps) {
    const user = await currentUser()
    if (!user) return null

    const { threads, isNext } = await getAllThreads(
        searchParams?.page ? Number(searchParams.page) : 1,
        20
    )

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

            <Pagination
                path=''
                currentPage={searchParams?.page ? Number(searchParams.page) : 1}
                isNext={isNext}
            />
        </>
    )
}
