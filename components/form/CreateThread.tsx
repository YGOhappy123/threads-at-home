'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '../ui/textarea'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import { threadSchema, ThreadInput } from '@/lib/validations/thread'
import { createThread } from '@/lib/actions/thread.actions'

interface IProps {
    userId: string
}

export default function CreateThread({ userId }: IProps) {
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<ThreadInput>({
        resolver: zodResolver(threadSchema),
        defaultValues: {
            thread: '',
            accountId: userId
        }
    })

    const onSubmit = async (values: ThreadInput) => {
        await createThread({
            content: values.thread,
            authorId: userId,
            communityId: null,
            path: pathname
        })

        router.push('/')
    }

    return (
        <Form {...form}>
            <form
                className='flex flex-col justify-start gap-10'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {/* Thread content input */}
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea rows={15} placeholder='Start a thread...' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' className='bg-primary-500 capitalize'>
                    Post Thread
                </Button>
            </form>
        </Form>
    )
}
