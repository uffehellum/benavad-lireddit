import { useForm } from "react-hook-form";
import React from "react";
import { Box, Button, space } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";


const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: "", password: "" } });
  const [{ data, fetching, error: submitError }, callMutate] =
    useRegisterMutation();
  console.log("fetching", fetching);
  console.log("data", data);

  async function onSubmit(values) {
    return callMutate(values);
  }

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
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
          {isSubmitting ? (
            <div>Submitting</div>
          ) : data ? (
            <pre>{JSON.stringify(data)}</pre>
          ) : submitError ? (
            <pre>{JSON.stringify(submitError)}</pre>
          ) : (
            <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
              Register
            </Button>
          )}
        </Box>
      </form>
    </Wrapper>
  );
};

export default Register;
