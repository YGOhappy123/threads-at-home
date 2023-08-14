import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { getUserData } from '@/lib/actions/user.actions'

export default async function CommunitiesPage() {
    const user = await currentUser()
    if (!user) return null

    const userData = await getUserData(user.id)
    if (!userData?.onboarded) redirect('/onboarding')

    return (
        <section>
            <h1 className='head-text mb-10'>Communities</h1>
        </section>
    )
}
