// "use server";

// import * as z from "zod";
// import bcrypt from "bcrypt";

// import { update } from "@/auth";
// import { db } from "@/lib/db";
// import { SettingsSchema } from "@/schemas";
// import { getUserByEmail } from '@/lib/user';
// import { currentUser } from "@/lib/auth";
// import { getUserByUsername } from "@/lib/username";

// export const settings = async (
//   values: z.infer<typeof SettingsSchema>
// ) => {
//   const user = await currentUser();

//   if (!user) {
//     return { error: "Unauthorized" }
//   }

//   const dbUser = await getUserById(user.id);

//   if (!dbUser) {
//     return { error: "Unauthorized" }
//   }

//   if (user.isOAuth) {
//     values.email = undefined;
//     values.password = undefined;
//     values.newPassword = undefined;
//   }

//   if (values.username && values.username !== user.username) {

//     const usernameAvailable = await getUserByUsername(values.username);
//     if (usernameAvailable) {
//       return { error: "Username already in use!" }
//     }

//   }

//   if (values.email && values.email !== user.email) {
//     const existingUser = await getUserByEmail(values.email);

//     if (existingUser && existingUser.id !== user.id) {
//       return { error: "Email already in use!" }
//     }

//   }

//   if (values.password && values.newPassword && dbUser.password) {
//     const passwordsMatch = await bcrypt.compare(
//       values.password,
//       dbUser.password,
//     );

//     if (!passwordsMatch) {
//       return { error: "Incorrect password!" };
//     }

//     const hashedPassword = await bcrypt.hash(
//       values.newPassword,
//       10,
//     );
//     values.password = hashedPassword;
//     values.newPassword = undefined;
//   }

//   const updatedUser = await db.user.update({
//     where: { id: dbUser.id },
//     data: {
//       ...values,
//     }
//   });

//   update({
//     user: {
//       name: updatedUser.name,
//       username: updatedUser.username as string,
//       email: updatedUser.email,
//       bio: updatedUser.bio,
//     }
//   });

//   return { success: "Settings Updated!" }
// }