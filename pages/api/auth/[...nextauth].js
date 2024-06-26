import { connectDB } from "@/util/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    // GithubProvider({
    //   clientId: "Github에서 발급받은 ID",
    //   clientSecret: "Github에서 발급받은 Secret",
    // }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        id: { label: "id", type: "text" },
        pw: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        let db = (await connectDB).db("fxtest");
        let user = await db
          .collection("user_cred")
          .findOne({ id: credentials.id });
        if (user.status != "정상") {
          console.log("승인되지 않음");
          return NULL;
        }
        if (!user) {
          console.log("해당 이메일은 없음");
          return NULL;
        }
        if (credentials.pw != user.pw) {
          console.log("비번틀림");
          return NULL;
        }
        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 3 * 60,
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {};
        token.user.name = user.name;
        token.user.id = user.id;
        token.user.role = user.role;
      }
      return token;
    },
    //5. 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },

  adapter: MongoDBAdapter(connectDB),
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
