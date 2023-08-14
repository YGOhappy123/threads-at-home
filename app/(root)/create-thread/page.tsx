import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getUserData } from '@/lib/actions/user.actions'
import CreateThread from '@/components/form/CreateThread'

export default async function CreateThreadPage() {
    const user = await currentUser()
    if (!user) return null

    const userData = await getUserData(user.id)
    if (!userData?.onboarded) redirect('/onboarding')

    return (
        <>
            <h1 className='head-text mb-10'>Create Thread</h1>
            <CreateThread userId={userData._id} />
        </>
    )
}
