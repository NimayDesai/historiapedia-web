import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { DarkModeSwitch } from "./DarkModeSwitch";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useApolloClient } from "@apollo/client";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const apolloClient = useApolloClient();
  let bar = null;

  if (loading) {
  } else if (!data?.me) {
    bar = (
      <>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={4}>Register</Link>
        </NextLink>
      </>
    );
  } else {
    bar = (
      <Flex align="center">
        <NextLink href="/dashboard">
          <Link mr={4}>Dashboard</Link>
        </NextLink>
        <Box mr={4}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            logout();
            await apolloClient.resetStore();
          }}
          mr={4}
          isLoading={logoutLoading}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} p={6}>
      <Box>
        <Flex align="center">
          <NextLink href="/">
            <Link mr={4}>
              <Heading>HistoriaPedia</Heading>
            </Link>
          </NextLink>
          <NextLink href="/articles">
            <Link mr={4}>
              <Heading size="md">Articles</Heading>
            </Link>
          </NextLink>
        </Flex>
      </Box>
      <Flex ml="auto" align="center">
        {bar}
        <DarkModeSwitch />
      </Flex>
    </Flex>
  );
};
