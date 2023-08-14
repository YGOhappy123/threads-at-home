import { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Threads Authentication',
    description: 'Authentication system created with Next.js 13 and Clerk'
}

export default function layout({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body className={`${inter.className} bg-dark-1`}>
                    <div className='w-full min-h-screen flex justify-center items-center'>
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}
