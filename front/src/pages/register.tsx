import { useForm } from "react-hook-form";
import React from "react";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";

const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: "", password: "" } });

  function onSubmit(values) {
    console.log(JSON.stringify(values, null, 2));
    // resolve();
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
        {/* <FormControl isInvalid={!!errors.username}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="username"
            placeholder="name"
            {...register("username", {
              required: "This is required",
              minLength: { value: 3, message: "Minimum length should be 4" },
            })}
          />
          <FormErrorMessage>
            {errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl> */}
        {/* <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="name">Password</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="password"
            {...register("password", {
              required: "This is required",
              minLength: { value: 3, message: "Minimum length should be 4" },
            })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl> */}
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Register
        </Button>
      </form>
    </Wrapper>
  );
};

export default Register;
