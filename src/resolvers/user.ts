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
import session from "express-session";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field() field: string;

  @Field() error: string;
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
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() { em, req }: MyContext) {
      const uid = req.session?.userId;
      if (!uid) {
        return null;
      }
      const user = await em.findOne(User, {id:uid});
      return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length < 3) {
      return {
        errors: [
          {
            field: "username",
            error: "username must be at least 3 characters",
          },
        ],
      };
    }
    if (options.password.length < 3) {
      return {
        errors: [
          {
            field: "password",
            error: "password must be at least 3 characters",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      name: options.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (e) {
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
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      name: data.username,
    });
    if (!user) {
      return { errors: [{ field: "user", error: "Can't find user" }] };
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
