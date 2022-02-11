import { useForm } from "react-hook-form";
import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

const LoginPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ defaultValues: { username: "", password: "" } });
  const [, callMutate] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <NavBar />
      <form
        onSubmit={handleSubmit(async (values) => {
          const result = await callMutate(values);
          if (result.data?.login.errors) {
            result.data.login.errors.forEach(({ field, error, __typename }) => {
              setError(
                field as "username" | "password", // Appease TS
                { message: error, type: __typename },
                { shouldFocus: false }
              );
            });
          }
          if (result.data?.login.user) {
            await router.push("/posts");
          }
        })}
      >
        <InputField
          errors={errors}
          label="Name"
          name="username"
          placeholder="username"
          register={register("username", {
            required: "This is required",
          })}
        />
        <InputField
          errors={errors}
          label="Password"
          name="password"
          placeholder="password"
          register={register("password", {
            required: "This is required",
          })}
          type="password"
        />
        <Box mt={4}>
          {isSubmitting ? (
            <div>Submitting</div>
          ) : (
            <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
              Login
            </Button>
          )}
        </Box>
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(LoginPage);
