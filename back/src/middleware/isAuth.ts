import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
context.userId = context.req.session.userId;
  if (!context.userId) {
    throw new Error("Not authenticated");
  }
  return next();
};
