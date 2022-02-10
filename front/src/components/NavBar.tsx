import React from "react";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}
export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [, logout] = useLogoutMutation();
  let body = null;
  if (fetching) {
    body = <div>Loading</div>;
  } else if (data?.me) {
    body = (
      <>
        <Button onClick={() => logout()}>Logout {data.me.name}</Button>
        <NextLink href="/posts">Posts</NextLink>
      </>
    );
  } else {
    body = (
      <>
        <NextLink href="/login">
          <Link>Login</Link>
        </NextLink>
        <NextLink href="/register">Register</NextLink>
      </>
    );
  }
  return (
    <Flex bg="tan" p={4}>
      <Box ml="auto">
        {body}
      </Box>
    </Flex>
  );
};
