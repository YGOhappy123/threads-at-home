import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { getUserData, fetchUsers } from '@/lib/actions/user.actions'
import UserCommunityCard from '@/components/cards/UserCommunityCard'

interface IProps {
    searchParams: { [key: string]: string | undefined }
}

export default async function SearchPage({ searchParams }: IProps) {
    const user = await currentUser()
    if (!user) return null

    const userData = await getUserData(user.id)
    if (!userData?.onboarded) redirect('/onboarding')

    const { users, isNext } = await fetchUsers({
        userId: user.id,
        searchTerm: '21',
        page: 1,
        limit: 25,
        sortBy: 'desc'
    })

    return (
        <section>
            <h1 className='head-text mb-10'>Search</h1>

            <div className='mt-14 flex flex-col gap-9'>
                {users.length === 0 ? (
                    <p className='no-result'>No Result</p>
                ) : (
                    <>
                        {users.map((person) => (
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
                )}
            </div>
        </section>
    )
}
