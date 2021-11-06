import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Wrapper } from "../components/Wrapper";
import { useMeQuery } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import NextLink from "next/link";
import { EditIcon } from "@chakra-ui/icons";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = ({}) => {
  const { data } = useMeQuery();

  useIsAuth();
  return (
    <Layout>
      <Flex height="800px">
        <Box
          borderRadius="8px"
          mt={8}
          borderWidth="1px"
          p="12"
          m="auto"
          w="800px"
        >
          <Flex>
            <Heading size="2xl" mb={8}>
              Dashboard
            </Heading>
            <Box ml="auto">
              <NextLink href="/change-user">
                <Button size="lg" as="a" rightIcon={<EditIcon />}>
                  Edit
                </Button>
              </NextLink>
            </Box>
          </Flex>

          <Stack>
            <Heading>Email:</Heading>
            <Text>{data?.me?.email}</Text>
            <Divider />
            <Heading>Username</Heading>
            <Text>{data?.me?.username}</Text>
            <Divider />
          </Stack>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Dashboard);
