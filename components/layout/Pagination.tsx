'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

interface IProps {
    currentPage: number
    isNext: boolean
    path: string
}

export default function Pagination({ currentPage, isNext, path }: IProps) {
    const router = useRouter()

    const handleNavigation = (type: string) => {
        let destinationPage = currentPage

        if (type === 'prev') {
            destinationPage = Math.max(1, currentPage - 1)
        } else if (type === 'next') {
            destinationPage = currentPage + 1
        }

        if (destinationPage > 1) {
            router.push(`/${path}?page=${destinationPage}`)
        } else {
            router.push(`/${path}`)
        }
    }

    if (!isNext && currentPage === 1) return null

    return (
        <div className='mt-10 flex w-full items-center justify-center gap-5'>
            <Button
                onClick={() => handleNavigation('prev')}
                disabled={currentPage === 1}
                className='!text-small-regular text-light-2'
            >
                Prev
            </Button>
            <p className='text-small-semibold text-light-1'>{currentPage}</p>
            <Button
                onClick={() => handleNavigation('next')}
                disabled={!isNext}
                className='!text-small-regular text-light-2'
            >
                Next
            </Button>
        </div>
    )
}
