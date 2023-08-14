'use client'

import { usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { CommentInput, commentSchema } from '@/lib/validations/thread'
import { addCommentToThread } from '@/lib/actions/thread.actions'
import Image from 'next/image'

interface IProps {
    threadId: string
    currentUserId: string
    currentUserImg: string
}

export default function CommentForm({ threadId, currentUserId, currentUserImg }: IProps) {
    const pathname = usePathname()

    const form = useForm<CommentInput>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            thread: ''
        }
    })

    const onSubmit = async (values: CommentInput) => {
        await addCommentToThread({
            threadId,
            content: values.thread,
            userId: currentUserId,
            path: pathname
        })

        form.reset()
    }

    return (
        <Form {...form}>
            <form
                className='mt-10 flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt='current_user'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    type='text'
                                    {...field}
                                    placeholder='Comment...'
                                    className='no-focus text-light-1 outline-none'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button
                    type='submit'
                    className='rounded-3xl bg-primary-500 px-8 py-2 !text-small-regular text-light-1 max-xs:w-full'
                >
                    Reply
                </Button>
            </form>
        </Form>
    )
}
