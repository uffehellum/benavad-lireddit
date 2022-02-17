import { Field, InputType } from "type-graphql";
import { FieldError } from "./FieldError";

@InputType()
export class UserRegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

export const validateUserRegisterInput = (
  data: UserRegisterInput
): FieldError[] => {
  if (!data.email.includes("@")) {
    return [
      {
        field: "email",
        error: "email must be valid",
      },
    ];
  }
  if (data.username.length < 3) {
    return [
      {
        field: "username",
        error: "username must be at least 3 characters",
      },
    ];
  }
  if (data.username.includes("@")) {
    return [
      {
        field: "username",
        error: "cannot include an @-sign",
      },
    ];
  }
  if (data.password.length < 3) {
    return [
      {
        field: "password",
        error: "password must be at least 3 characters",
      },
    ];
  }
  return [];
};
