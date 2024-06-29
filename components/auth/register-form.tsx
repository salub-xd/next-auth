"use client";

import { CardWrapper } from '@/components/auth/card-wrapper';
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useState, useTransition } from 'react';
import { register } from '@/actions/register';
import { ClipLoader } from 'react-spinners';

const RegisterForm = () => {

    const [isPending, startTransition] = useTransition();
    const [isError, setIsError] = useState<string | undefined>("");
    const [isSuccess, setIsSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: '',
            password: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setIsError("");
        setIsSuccess("");
        startTransition(() => {
            register(values).then((data) => {
                setIsSuccess(data.success)
                setIsError(data.error)
            })
        });

    }
    return (
        <CardWrapper
            headerLabel='Create an account'
            backButtonLabel='Already have an account?'
            backButtonHref='/auth/login'
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} type='name' placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} type='email' placeholder="johndoe@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} type='password' placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormError message={isError} />
                    <FormSuccess message={isSuccess} />
                    <Button disabled={isPending} type="submit" className='w-full'> Create an account</Button>

                </form>
            </Form>
        </CardWrapper>
    )
}

export default RegisterForm;
