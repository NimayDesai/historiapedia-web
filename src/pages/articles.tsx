import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { ArticleLikeSection } from "../components/ArticleLikeSection";
import { Layout } from "../components/Layout";
import { LikeSection } from "../components/LikeSection";
import { NavBar } from "../components/NavBar";
import { useArticlesQuery, useCommentsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
import NextLink from "next/link";

interface articlesProps {}

const Articles: React.FC<articlesProps> = ({}) => {
  const { data, loading, fetchMore, variables } = useArticlesQuery({
    variables: {
      limit: 10,
      cursor: null as null | string,
    },
  });

  if (!loading && !data) {
    return <div>Could not get articles</div>;
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>Latest Articles</Heading>
        <NextLink href="/create-article">
          <Link ml="auto">New Article</Link>
        </NextLink>
      </Flex>
      <br />
      {!data && loading ? (
        <Box>loading...</Box>
      ) : (
        <Stack spacing={8}>
          {data!.articles.articles.map((p) => (
            <>
              <Flex borderWidth="1px" borderRadius="8px" key={p.id} p={10}>
                <ArticleLikeSection article={p} />
                <Box>
                  <NextLink href="/article/[id]" as={`/article/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text mt={4}>Made by: {p.creator.username}</Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
              </Flex>
            </>
          ))}
        </Stack>
      )}
      {data && data.articles.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.articles.articles[data.articles.articles.length - 1]
                      .createdAt,
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
    </Layout>
  );
};

export default withApollo({ ssr: true })(Articles);
