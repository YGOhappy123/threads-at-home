import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { getUserData } from '@/lib/actions/user.actions'
import { fetchCommunities } from '@/lib/actions/community.actions'
import SearchBar from '@/components/layout/SearchBar'
import CommunityCard from '@/components/cards/CommunityCard'
import Pagination from '@/components/layout/Pagination'

interface IProps {
    searchParams: { [key: string]: string | undefined }
}

export default async function CommunitiesPage({ searchParams }: IProps) {
    const user = await currentUser()
    if (!user) return null

    const userData = await getUserData(user.id)
    if (!userData?.onboarded) redirect('/onboarding')

    const { communities, isNext } = await fetchCommunities({
        searchTerm: searchParams.q,
        page: searchParams?.page ? Number(searchParams.page) : 1,
        limit: 25,
        sortBy: 'desc'
    })

    return (
        <section>
            <h1 className='head-text mb-10'>Communities</h1>

            <SearchBar routeType='communities' />

            <section className='mt-9 grid grid-cols-1 md:grid-cols-2 gap-4'>
                {communities.length === 0 ? (
                    <p className='no-result col-span-2'>No Result</p>
                ) : (
                    <>
                        {communities.map((community) => (
                            <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                imgUrl={community.image}
                                bio={community.bio}
                                members={community.members}
                            />
                        ))}
                    </>
                )}
            </section>

            <Pagination
                path='communities'
                currentPage={searchParams?.page ? Number(searchParams.page) : 1}
                isNext={isNext}
            />
        </section>
    )
}
