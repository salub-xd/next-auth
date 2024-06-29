import { db } from "@/lib/db";

export const getUserByUsername = async (username: string) => {

    try {
        const user = await db.user.findUnique({
            where: {
                username: username
            }
        });

        return user;

    } catch (error) {
        return null;
    }
}

export const generateUsername = async (email: string) => {
    // Extract username from email
    let username = email.substring(0, email.indexOf('@'));

    // Remove special characters and spaces from the username
    username = username.replace(/[^a-zA-Z0-9_]/g, '');

    // Limit the length of the username
    const maxLength = 16;
    if (username.length > maxLength) {
        username = username.substring(0, maxLength);
    }

    let usernameAvailable = await getUserByUsername(username);

    if (usernameAvailable) {
        const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
        username += randomNumber;
    }

    return username;
}

export const saveUsername = async (id: string, username: string) => {

    let saveUsername = await db.user.update({
        where: {
            id
        },
        data: {
            username
        }
    });

    return saveUsername;
}