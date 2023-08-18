import { currentUser } from '@clerk/nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCommunityDetails } from '@/lib/actions/community.actions'
import { COMMUNITY_TABS } from '@/constants'
import Image from 'next/image'
import ProfileHeader from '@/components/layout/ProfileHeader'
import ThreadsTab from '@/components/layout/ThreadsTab'
import UserCommunityCard from '@/components/cards/UserCommunityCard'

interface IProps {
    params: { id: string }
}

export default async function CommunityDetailsPage({ params: { id } }: IProps) {
    if (!id) return null

    const user = await currentUser()
    if (!user) return null

    const communityDetails = await getCommunityDetails(id)

    // return <h1 className='head-text'>Community Details</h1>

    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.id}
                currentUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type='Community'
            />

            <div className='mt-9'>
                <Tabs defaultValue='threads' className='w-full'>
                    <TabsList className='flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-3'>
                        {COMMUNITY_TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className='flex min-h-[42px] flex-1 items-center gap-3 bg-dark-2 data-[state=active]:bg-[#0e0e12] data-[state=active]:text-light-1'
                            >
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className='object-contain'
                                />
                                <p className='max-sm:hidden'>{tab.label}</p>

                                {tab.label === 'Threads' && (
                                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        {communityDetails.threads.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value='threads' className='w-full text-light-1'>
                        <ThreadsTab
                            authUserId={user.id}
                            targetId={communityDetails.id}
                            type='Community'
                        />
                    </TabsContent>

                    <TabsContent value='members' className='w-full text-light-1'>
                        <section className='mt-9 flex flex-col gap-10'>
                            {communityDetails.members.map((member: any) => (
                                <UserCommunityCard
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imageUrl={member.image}
                                    cardType='User'
                                />
                            ))}
                        </section>
                    </TabsContent>

                    <TabsContent value='requests' className='w-full text-light-1'>
                        <ThreadsTab
                            authUserId={user.id}
                            targetId={communityDetails.id}
                            type='Community'
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}
