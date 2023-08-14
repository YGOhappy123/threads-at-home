import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { getUserActivities, getUserData } from '@/lib/actions/user.actions'
import Link from 'next/link'
import Image from 'next/image'

export default async function ActivityPage() {
    const user = await currentUser()
    if (!user) return null

    const userData = await getUserData(user.id)
    if (!userData?.onboarded) redirect('/onboarding')

    const activities = await getUserActivities(userData._id)

    return (
        <section>
            <h1 className='head-text mb-10'>Activity</h1>

            <div className='mt-10 flex flex-col gap-5'>
                {activities.length === 0 ? (
                    <p className='!text-base-regular text-light-3'>No activity yet</p>
                ) : (
                    <>
                        {activities.map((activity) => (
                            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                                <article className='activity-card'>
                                    <Image
                                        src={activity.author.image}
                                        alt='user_logo'
                                        width={20}
                                        height={20}
                                        className='rounded-full object-cover'
                                    />

                                    <p className='!text-small-regular text-light-1'>
                                        <span className='mr-1 text-primary-500'>
                                            {activity.author.name}
                                        </span>{' '}
                                        replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}
