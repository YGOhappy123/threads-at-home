'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { SIDEBAR_LINKS } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'

export default function BottomBar() {
    const pathname = usePathname()
    const { userId } = useAuth()

    return (
        // Act as a sidebar for vertical screen devices
        <section className='fixed bottom-0 z-10 w-full rounded-t-3xl bg-glassmorphism p-4 backdrop-blur-lg xs:px-7 md:hidden'>
            <div className='flex items-center justify-between gap-3 xs:gap-5'>
                {SIDEBAR_LINKS.map((link) => {
                    // Directly match or with additional params (except home '/')
                    const isActive =
                        (pathname.includes(link.route) && link.route.length > 1) ||
                        pathname === link.route

                    if (link.route === '/profile') link.route = `/profile/${userId}`

                    return (
                        <Link
                            href={link.route}
                            key={link.route}
                            className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${
                                isActive && 'bg-primary-500'
                            }`}
                        >
                            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                            <p className='text-subtle-medium text-light-1 max-sm:hidden text-center'>
                                {link.label.split(' ')[0]}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
