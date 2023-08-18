'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import Image from 'next/image'

interface IProps {
    id: string
    name: string
    username: string
    imageUrl: string
    cardType: 'User' | 'Community'
}

export default function UserCommunityCard({ id, name, username, imageUrl, cardType }: IProps) {
    const router = useRouter()
    const isCommunity = cardType === 'Community'

    return (
        <article className='flex flex-col justify-between gap-4 max-xs:rounded-xl max-xs:bg-dark-3 max-xs:p-4 xs:flex-row xs:items-center'>
            <div className='flex flex-1 items-start justify-start gap-3 xs:items-center'>
                <div className='relative h-12 w-12'>
                    <Image
                        src={imageUrl}
                        alt='user_logo'
                        fill
                        className='rounded-full object-cover'
                    />
                </div>

                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold text-light-1 line-clamp-1 break-all'>
                        {name}
                    </h4>
                    <p className='text-small-medium text-gray-1 line-clamp-1 break-all'>
                        @{username}
                    </p>
                </div>
            </div>

            <Button
                className='h-auto min-w-[74px] rounded-lg bg-primary-500 text-[12px] text-light-1'
                onClick={() => {
                    if (isCommunity) {
                        router.push(`/communities/${id}`)
                    } else {
                        router.push(`/profile/${id}`)
                    }
                }}
            >
                View
            </Button>
        </article>
    )
}
