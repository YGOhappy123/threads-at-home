'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import Image from 'next/image'

interface IProps {
    routeType: string
}

export default function SearchBar({ routeType }: IProps) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                router.push(`/${routeType}?q=` + searchTerm)
            } else {
                router.push(`/${routeType}`)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm, routeType])

    return (
        <div className='flex gap-1 rounded-lg bg-dark-3 px-4 py-2'>
            <Image
                src='/assets/search-gray.svg'
                alt='search'
                width={24}
                height={24}
                className='object-contain'
            />
            <Input
                id='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`${routeType !== 'search' ? 'Search communities' : 'Search creators'}`}
                className='no-focus border-none bg-dark-3 text-base-regular text-light-4 outline-none'
            />
        </div>
    )
}
