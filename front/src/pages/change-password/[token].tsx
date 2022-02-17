import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../../components/InputField";
import { NavBar } from "../../components/NavBar";
import { Wrapper } from "../../components/Wrapper";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useChangePasswordMutation } from "../../generated/graphql";
// TODO: Delete import { toErrorMap } from "../../utils/toErrorMap";


const ChangePassword = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ defaultValues: { newPassword: "" } });
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <NavBar />
      <form
        onSubmit={handleSubmit(async (values) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });
          if (response.data?.changePassword.errors) {
            response.data.changePassword.errors.forEach(
              ({ field, error, __typename }) => {
                console.error(field, error);
                if (field === "token") {
                  setTokenError(error);
                } else {
                  setError(
                    field as "newPassword", // Appease TS
                    { message: error, type: __typename },
                    { shouldFocus: false }
                  );
                }
              }
            );
          }
          if (response.data?.changePassword.user) {
            await router.push("/posts");
          }
        })}
      >
        <InputField
          errors={errors}
          label="New Password"
          name="new password"
          placeholder="new password"
          register={register("newPassword", {
            required: "This is required",
          })}
          type="password"
        />
        <Box mt={4}>
          {isSubmitting ? (
            <div>Submitting</div>
          ) : (
            <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
              Change password
            </Button>
          )}
        </Box>
        {tokenError ? (
          <Flex>
            <Box color="red" mr={2}>{tokenError}</Box>
            <NextLink href="/forgot-password">
              <Link>Send a new token</Link>
            </NextLink>
          </Flex>
        ) : null}
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
