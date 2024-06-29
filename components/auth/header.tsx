import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'

const font = Poppins({
    subsets: ['latin'],
    weight: '600',
})

interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <p className={cn('text-muted-foreground text-sm', font.className)}>{label}</p>
        </div>
    )
}