'use client'

import { ChangeEvent, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
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
import Image from 'next/image'

import { updateUser } from '@/lib/actions/user.actions'
import { userSchema, UserInput } from '@/lib/validations/user'
import { useUploadThing } from '@/lib/uploadthing'
import { isBase64Image } from '@/lib/utils'

interface IUser {
    id: string
    objectId: string
    username: string
    name: string
    bio: string
    image: string
}

interface IProps {
    user: IUser
    btnTitle: string
}

export default function AccountProfile({ user, btnTitle }: IProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { startUpload } = useUploadThing('media')
    const [photoFiles, setPhotoFiles] = useState<File[]>([])

    const form = useForm<UserInput>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            profile_photo: user?.image || '',
            name: user?.name || '',
            username: user?.username || '',
            bio: user?.bio || ''
        }
    })

    const handleUploadImage = (
        e: ChangeEvent<HTMLInputElement>,
        updateField: (value: string) => void
    ) => {
        e.preventDefault()
        const fileReader = new FileReader()

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setPhotoFiles(Array.from(e.target.files))

            if (!file.type.includes('image')) return

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || ''
                updateField(imageDataUrl)
            }
            fileReader.readAsDataURL(file)
        }
    }

    const onSubmit = async (values: UserInput) => {
        const currentImage = values.profile_photo
        const isNewImageUploaded = isBase64Image(currentImage)

        if (isNewImageUploaded) {
            const imgResponse = await startUpload(photoFiles)
            if (imgResponse && imgResponse[0].fileUrl) {
                values.profile_photo = imgResponse[0].fileUrl
            }
        }

        await updateUser({
            name: values.name,
            path: pathname,
            username: values.username,
            userId: user.id,
            bio: values.bio,
            image: values.profile_photo
        })

        if (pathname === '/profile/edit') {
            router.back()
        } else {
            router.push('/')
        }
    }

    return (
        <Form {...form}>
            <form
                className='flex flex-col justify-start gap-10'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {/* Profile picture file input */}
                <FormField
                    control={form.control}
                    name='profile_photo'
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
                                {field.value ? (
                                    <div className='w-24 h-24 relative'>
                                        <Image
                                            src={field.value}
                                            alt='profile_icon'
                                            fill
                                            priority
                                            className='rounded-full object-contain'
                                        />
                                    </div>
                                ) : (
                                    <Image
                                        src='/assets/profile.svg'
                                        alt='profile_icon'
                                        width={24}
                                        height={24}
                                        className='object-contain'
                                    />
                                )}
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    placeholder='Add profile photo'
                                    onChange={(e) => handleUploadImage(e, field.onChange)}
                                    className='account-form_image-input'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Full name input */}
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>Name</FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    {...field}
                                    className='account-form_input no-focus'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Username input */}
                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    {...field}
                                    className='account-form_input no-focus'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Profile bio input */}
                <FormField
                    control={form.control}
                    name='bio'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    {...field}
                                    className='account-form_input no-focus'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' className='bg-primary-500 capitalize'>
                    {btnTitle}
                </Button>
            </form>
        </Form>
    )
}
