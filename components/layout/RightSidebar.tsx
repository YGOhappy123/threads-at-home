export default function RightSidebar() {
    const suggestedCommunities = {
        communities: []
    }

    return (
        <section className='custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l border-l-dark-4 bg-dark-2 px-10 pb-6 pt-28 max-xl:hidden'>
            {/* Suggested communities */}
            <div className='flex flex-1 flex-col justify-start'>
                <h3 className='text-heading4-medium text-light-1'>Suggested Communities</h3>
                <div className='mt-7 flex w-[350px] flex-col gap-9'>
                    {suggestedCommunities.communities.length > 0 ? (
                        <>
                            {/* {suggestedCommunities.communities.map((community) => (
                                <UserCard
                                    key={community.id}
                                    id={community.id}
                                    name={community.name}
                                    username={community.username}
                                    imgUrl={community.image}
                                    personType='Community'
                                />
                            ))} */}
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
                    {suggestedCommunities.communities.length > 0 ? (
                        <>
                            {/* {suggestedCommunities.communities.map((community) => (
                                <UserCard
                                    key={community.id}
                                    id={community.id}
                                    name={community.name}
                                    username={community.username}
                                    imgUrl={community.image}
                                    personType='Community'
                                />
                            ))} */}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No users yet</p>
                    )}
                </div>
            </div>
        </section>
    )
}
