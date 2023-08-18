import { currentUser } from '@clerk/nextjs'
import { fetchUsers } from '@/lib/actions/user.actions'
import UserCommunityCard from '../cards/UserCommunityCard'
import { fetchCommunities } from '@/lib/actions/community.actions'

export default async function RightSidebar() {
    const user = await currentUser()
    if (!user) return null

    const suggestedCommunities = await fetchCommunities({ limit: 4 })
    const similarMinds = await fetchUsers({
        userId: user.id,
        limit: 4
    })

    return (
        <section className='custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l border-l-dark-4 bg-dark-2 px-10 pb-6 pt-28 max-xl:hidden'>
            {/* Suggested communities */}
            <div className='flex flex-1 flex-col justify-start'>
                <h3 className='text-heading4-medium text-light-1'>Suggested Communities</h3>
                <div className='mt-7 flex w-[350px] flex-col gap-9'>
                    {suggestedCommunities.communities.length > 0 ? (
                        <>
                            {suggestedCommunities.communities.map((community) => (
                                <UserCommunityCard
                                    key={community.id}
                                    id={community.id}
                                    name={community.name}
                                    username={community.username}
                                    imageUrl={community.image}
                                    cardType='Community'
                                />
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No communities yet</p>
                    )}
                </div>
            </div>

            {/* Suggested users */}
            <div className='flex flex-1 flex-col justify-start'>
                <h3 className='text-heading4-medium text-light-1'>Suggested Users</h3>
                <div className='mt-7 flex w-[350px] flex-col gap-9'>
                    {similarMinds.users.length > 0 ? (
                        <>
                            {similarMinds.users.map((person) => (
                                <UserCommunityCard
                                    key={person.id}
                                    id={person.id}
                                    name={person.name}
                                    username={person.username}
                                    imageUrl={person.image}
                                    cardType='User'
                                />
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No users yet</p>
                    )}
                </div>
            </div>
        </section>
    )
}
