import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { PASSWORD_RESET_PREFIX, SESSION_COOKIE_NAME } from "../constants";
import {
  UserRegisterInput,
  validateUserRegisterInput,
} from "./UserRegisterInput";
import { FieldError } from "./FieldError";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
// import { getConnection } from "typeorm";

@InputType()
class UsernamePasswordInput {
  @Field()
  usernameOrEmail: string;

  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    const uid = req.session?.userId;
    if (!uid) {
      return null;
    }
    return User.findOne(uid);
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("newPassword") newPassword: string,
    @Arg("token") token: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    const key = PASSWORD_RESET_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return { errors: [{ field: "token", error: "Token is expired" }] };
    }
    const id = parseInt(userId);
    const user = await User.findOne(id);
    if (!user) {
      return { errors: [{ field: "token", error: "User no longer exists" }] };
    }
    const newHash = await argon2.hash(newPassword);
    User.update({ id }, { password: newHash });
    redis.del(key);
    req.session!.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("forgotPassword not found", email);
      return true; // not found
    }
    const token = v4();
    const changePassword = `http://localhost:3000/change-password/${token}`;
    const html = `<a href="${changePassword}">Reset password</a>`;
    const threeDays = 1000 * 60 * 60 * 24 * 3;
    await redis.set(PASSWORD_RESET_PREFIX + token, user.id, "ex", threeDays);
    console.log("forgotPassword", user.email, html);
    await sendEmail(user.email, "Reset lireddit password", html);
    return true;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.error("logout", err);
          resolve(false);
        } else {
          res.clearCookie(SESSION_COOKIE_NAME);
          resolve(true);
        }
      })
    );
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UserRegisterInput) options: UserRegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateUserRegisterInput(options);
    if (errors?.length) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = User.create({
      email: options.email,
      name: options.username,
      password: hashedPassword,
    });
    // let user;
    try {
      console.log("about to register", user);
      await user.save();
      // const result = await getConnection()
      //   .createQueryBuilder()
      //   .insert()
      //   .into(User)
      //   .values({
      //     email: options.email,
      //     name: options.username,
      //     password: hashedPassword,
      //   })
      //   .returning("*")
      //   .execute();
      // console.log("result", result);
      // user = result.raw[0];
    } catch (e) {
      console.error('e', e);
      if (e.code === "23505" || e.detail.includes("already exists.")) {
        return {
          errors: [
            {
              field: "username",
              error: "user already exists",
            },
          ],
        };
      }
      return {
        errors: [
          {
            field: "unknown",
            error: e.message,
          },
        ],
      };
    }
    req.session!.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput) data: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      data.usernameOrEmail.includes("@")
        ? { where: { email: data.usernameOrEmail } }
        : { where: { name: data.usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [{ field: "usernameOrEmail", error: "Can't find user" }],
      };
    }
    const isMatch: boolean = await argon2.verify(user.password, data.password);
    if (!isMatch) {
      return {
        errors: [{ field: "password", error: "Password does not match" }],
      };
    }
    req.session!.userId = user.id;
    return { user };
  }
}
