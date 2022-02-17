import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

const ForgotPassword: React.FC<{}> = ({}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ defaultValues: { email: "" } });
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <NavBar />
      <form
        onSubmit={handleSubmit(async (values) => {
          const result = await forgotPassword(values);
          if (result.data?.forgotPassword) {
            setComplete(true);
          } else {
            setError(
              "email", // Appease TS
              { message: "failed to send password reset link" },
              { shouldFocus: false }
            );
          }
        })}
      >
        <Box>
          <InputField
            errors={errors}
            label="email"
            name="email"
            placeholder="email"
            register={register("email", {
              required: "This is required",
            })}
          />
        </Box>
        <Box mt={4}>
          {isSubmitting ? (
            <div>Submitting</div>
          ) : (
            <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
              Send reset password token
            </Button>
          )}
        </Box>
        {complete && <div>Check your email to see your account reset link</div>}
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
