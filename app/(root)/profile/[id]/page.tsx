import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { getUserData } from '@/lib/actions/user.actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PROFILE_TABS } from '@/constants'
import Image from 'next/image'
import ProfileHeader from '@/components/layout/ProfileHeader'
import ThreadsTab from '@/components/layout/ThreadsTab'

interface IProps {
    params: { id: string }
}

export default async function ProfilePage({ params: { id } }: IProps) {
    if (!id) return null

    const authUser = await currentUser()
    if (!authUser) return null

    const profileData = await getUserData(id)
    if (!profileData?.onboarded) redirect(id === authUser.id ? '/onboarding' : '/')

    return (
        <section>
            <ProfileHeader
                accountId={profileData.id}
                currentUserId={authUser.id}
                name={profileData.name}
                username={profileData.username}
                imgUrl={profileData.image}
                bio={profileData.bio}
            />

            <div className='mt-9'>
                <Tabs defaultValue='threads' className='w-full'>
                    <TabsList className='flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-3'>
                        {PROFILE_TABS.map((tab) => (
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
                                        {profileData.threads.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {PROFILE_TABS.map((tab) => (
                        <TabsContent
                            key={`content-${tab.label}`}
                            value={tab.value}
                            className='w-full text-light-1'
                        >
                            <ThreadsTab
                                authUserId={authUser.id}
                                targetId={profileData.id}
                                type='User'
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}
