import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { CommentsQuery, PaginatedComments } from "../generated/graphql";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          comments: {
            keyArgs: [""],
            merge(
              existing: PaginatedComments | undefined,
              incoming: PaginatedComments
            ): PaginatedComments {
              return {
                ...incoming,
                comments: [...(existing?.comments || []), ...incoming.comments],
              };
            },
          },
        },
      },
    },
  }),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
