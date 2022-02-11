import { useForm } from "react-hook-form";
import React from "react";
import { Box, Button, FormErrorMessage } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Register = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ defaultValues: { username: "", password: "" } });
  const [{ data, fetching, error: submitError }, callMutate] =
    useRegisterMutation();
  console.log("fetching, isSubmitting", fetching, isSubmitting);
  console.log("data", data);

  return (
    <Wrapper variant="small">
      <NavBar />
      <form
        onSubmit={handleSubmit(async (values) => {
          const result = await callMutate(values);
          console.log("result", result);
          if (result.data?.register.errors) {
            console.log("errors:", result.data.register.errors);
            result.data.register.errors.forEach(
              ({ field, error, __typename }) => {
                console.log("setting ui error", field, error);
                setError(
                  field as "username" | "password", // Appease TS
                  { message: error, type: __typename },
                  { shouldFocus: false }
                );
              }
            );
          }
          if (result.data?.register.user) {
            console.log("success, user:", result.data?.register.user);
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
            minLength: { value: 3, message: "Minimum length should be 3" },
          })}
        />
        <InputField
          errors={errors}
          label="Password"
          name="password"
          placeholder="password"
          register={register("password", {
            required: "This is required",
            minLength: { value: 3, message: "Minimum length should be 3" },
          })}
          type="password"
        />
        <Box mt={4}>
          {fetching && <div>Fetching</div>}
          {isSubmitting ? (
            <div>Submitting</div>
          ) : (
            <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
              Register
            </Button>
          )}
          {submitError && (
            <FormErrorMessage>
              submit error
              <pre>{JSON.stringify(submitError, null, 2)}</pre>
            </FormErrorMessage>
          )}
          {data?.register?.errors?.length && (
            <div>
              {" "}
              register errors
              <pre>{JSON.stringify(data?.register?.errors, null, 2)}</pre>
            </div>
          )}
        </Box>
        {data?.register?.user && (
          <Box>
            <pre>{JSON.stringify(data?.register?.user, null, 2)}</pre>
          </Box>
        )}
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
