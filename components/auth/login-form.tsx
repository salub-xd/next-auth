"use client";

import { CardWrapper } from '@/components/auth/card-wrapper';
import { LoginSchema } from '@/schemas';
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
import { login } from '@/actions/login';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
// import { ClipLoader } from 'react-spinners';
// 
const LoginForm = () => {

    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const [isPending, startTransition] = useTransition();
    const [isError, setIsError] = useState<string | undefined>("");
    const [isSuccess, setIsSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setIsError("");
        setIsSuccess("");
        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    form.reset();
                    setIsError(data?.error)
                }
                // if (data?.success) {
                //     form.reset();
                //     setIsSuccess(data?.success)
                // }
                // if (data?.twoFactor) {
                //     setShowTwoFactor(true);
                // }
            }).catch(() => {
                setIsError("Something went wrong")
            })
        });

    }
    return (
        <CardWrapper
            headerLabel='Welcome back'
            backButtonLabel='Dont have an account?'
            backButtonHref='/auth/register'
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {showTwoFactor && (
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Two Factor Code</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    {!showTwoFactor && (
                        <>
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
                                        <Button
                                            disabled={isPending}
                                            size={"sm"}
                                            variant={"link"}
                                            className='px-0 font-normal'
                                        >
                                            <Link
                                                href={'/auth/reset'}
                                            >
                                                Forget Password?
                                            </Link>
                                        </Button>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    <FormError message={isError || urlError} />
                    <FormSuccess message={isSuccess} />
                    <Button disabled={isPending} type="submit" className='w-full'> Login</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default LoginForm;
