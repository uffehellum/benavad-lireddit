import React from "react";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}
export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({pause: isServer()});
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;
  if (fetching) {
    body = <div>Loading</div>;
  } else if (data?.me) {
    body = (
      <>
        <NextLink href="/">Root</NextLink>
        <NextLink href="/posts">Posts</NextLink>
        <Button
          variant="link"
          isLoading={logoutFetching}
          onClick={async () => {
            await logout();
          }}
        >
          Logout {data.me.name}
        </Button>
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
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
