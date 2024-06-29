'use client';

import React from 'react'
import { logout } from '@/actions/logout'

export const LogoutButton = ({
    children
}: { children: React.ReactNode }) => {

    const onClick = () => {
        logout();
    }
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
}