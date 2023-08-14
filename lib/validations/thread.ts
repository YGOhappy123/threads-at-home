import * as z from 'zod'

export const threadSchema = z.object({
    thread: z.string().nonempty().min(3, { message: 'Minimum 3 characters.' }),
    accountId: z.string()
})

export type ThreadInput = z.infer<typeof threadSchema>

export const commentSchema = z.object({
    thread: z.string().nonempty().min(3, { message: 'Minimum 3 characters.' })
})

export type CommentInput = z.infer<typeof commentSchema>
