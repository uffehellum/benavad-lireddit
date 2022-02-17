import { useForm } from "react-hook-form";
import React from "react";
import NextLink from "next/link";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
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
  } = useForm({ defaultValues: { usernameOrEmail: "", password: "" } });
  const [, callMutate] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <NavBar />
      <form
        onSubmit={handleSubmit(async (values) => {
          const result = await callMutate(values);
          if (result.data?.login.errors) {
            result.data.login.errors.forEach(({ field, error, __typename }) => {
              console.error(field, error);
              setError(
                field as "usernameOrEmail" | "password", // Appease TS
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
          label="Name or email"
          name="usernameOrEmail"
          placeholder="username or email"
          register={register("usernameOrEmail", {
            required: "This is required",
          })}
        />
        <Box>
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
        </Box>
        <Flex mt={2}>
          <NextLink href="/forgot-password">
            <Link ml="auto">I forgot my password</Link>
          </NextLink>
        </Flex>
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
