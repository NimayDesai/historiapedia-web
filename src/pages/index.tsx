import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { useCommentsQuery } from "../generated/graphql";
import NextLink from "next/link";

const Index = () => {
  const { data, loading, fetchMore, variables } = useCommentsQuery({
    variables: {
      limit: 10,
      cursor: null as null | string,
    },
  });

  if (!loading && !data) {
    return <div>Could not get comments</div>;
  }

  return (
    <Layout>
      <Flex mx="auto" align="center" w="100%" maxW={800} mt={100}>
        <Stack textAlign="center">
          <Heading fontSize="6xl">
            Find all of your history needs in one place
          </Heading>
          <br />
          <Text fontSize="xl" mx="auto" color="gray">
            HistoriaPedia is a curated history resource from all time periods
            for school or if you are just curious and just want to learn
            something new.
          </Text>
          <br />
          <Box align="center" pb="50px">
            <Button
              as={Link}
              size="lg"
              colorScheme="green"
              mr={8}
              rightIcon={<ArrowForwardIcon />}
            >
              Get Started
            </Button>
            <Button as={Link} size="lg" colorScheme="gray">
              Source Code
            </Button>
          </Box>
          <Divider />
          <Heading fontSize="6xl" pt="50px">
            Features
          </Heading>
          <Heading fontSize="3xl" pt="50px">
            Every time era
          </Heading>

          <Text fontSize="xl" color="gray">
            HistoriaPedia provides history from all places around the world and
            all time eras. Stop going from website to website for your history
            projects. HistoriaPedia has it all
          </Text>
          <br />
          <Flex align="center">
            <Heading>Comments</Heading>
            <NextLink href="/create-comment">
              <Link ml="auto">New Comment</Link>
            </NextLink>
          </Flex>
          <br />
          {!data && loading ? (
            <Box>loading...</Box>
          ) : (
            <Stack spacing={8}>
              {data!.comments.comments.map((p) => (
                <Box
                  key={p.id}
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="8px"
                >
                  <Heading fontSize="xl" textAlign="left">
                    {p.title}
                  </Heading>
                  <Text textAlign="left" mt={4}>
                    {p.textSnippet}
                  </Text>
                </Box>
              ))}
            </Stack>
          )}
          {data && data.comments.hasMore ? (
            <Flex>
              <Button
                onClick={() => {
                  fetchMore({
                    variables: {
                      limit: variables?.limit,
                      cursor:
                        data.comments.comments[
                          data.comments.comments.length - 1
                        ].createdAt,
                    },
                  });
                }}
                isLoading={loading}
                m="auto"
                my={8}
              >
                Load more
              </Button>
            </Flex>
          ) : null}
        </Stack>
      </Flex>
    </Layout>
  );
};

export default Index;
