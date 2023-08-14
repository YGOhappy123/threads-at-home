'use client'

import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs'
import { SIDEBAR_LINKS } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'

export default function LeftSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { userId } = useAuth()

    return (
        <section className='custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-dark-2 pb-5 pt-28 max-md:hidden'>
            {/* Sidebar links */}
            <div className='flex w-full flex-1 flex-col gap-6 px-6'>
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
                            className={`relative flex justify-start gap-4 rounded-lg p-4 ${
                                isActive && 'bg-primary-500'
                            }`}
                        >
                            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                            <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                        </Link>
                    )
                })}
            </div>

            {/* Sign out button (if having user session) */}
            <div className='mt-10 px-6'>
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                        <div className='flex cursor-pointer gap-4 p-4'>
                            <Image src='/assets/logout.svg' alt='logout' width={24} height={24} />
                            <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}
