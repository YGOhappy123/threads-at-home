import { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import TopBar from '@/components/layout/TopBar'
import BottomBar from '@/components/layout/BottomBar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Threads',
    description: 'A Next.js 13 Meta Threads application'
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body className={inter.className}>
                    <TopBar />

                    <main className='flex flex-row'>
                        <LeftSidebar />
                        <section className='main-container'>
                            <div className='w-full max-w-4xl'>{children}</div>
                        </section>
                        <RightSidebar />
                    </main>

                    <BottomBar />
                </body>
            </html>
        </ClerkProvider>
    )
}
