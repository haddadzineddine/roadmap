// Careful not to remove this import (for example when saving the file)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Jwt {
    accessToken: string;
    email: string;
    name: string;
    uuid: string;
  }

  interface Session {
    user: {
      accessToken: string;
      email: string;
      name: string;
      uuid: string;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken: string;
    email: string;
    name: string;
    uuid: string;
  }
}