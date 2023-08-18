import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { getUserData } from '@/lib/actions/user.actions'
import AccountProfile from '@/components/form/AccountProfile'

export default async function onboardingPage() {
    const clerkUserData = await currentUser()
    if (!clerkUserData) return null

    const dbUserData = await getUserData(clerkUserData.id)
    if (dbUserData?.onboarded) redirect('/')

    const userData = {
        id: clerkUserData?.id,
        objectId: dbUserData?._id,
        username: dbUserData?.username || clerkUserData?.username,
        name: dbUserData?.name || clerkUserData?.firstName || '',
        bio: dbUserData?.bio || '',
        image: dbUserData?.image || clerkUserData?.imageUrl
    }

    return (
        <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
            <h1 className='head-text'>Onboarding</h1>
            <p className='mt-3 text-base-regular text-light-2'>
                Complete your profile now, to use Threads.
            </p>

            <section className='mt-9 bg-dark-2 p-10 rounded'>
                <AccountProfile user={userData} btnTitle='Continue' />
            </section>
        </main>
    )
}
