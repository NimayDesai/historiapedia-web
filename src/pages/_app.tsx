import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { CommentsQuery, PaginatedComments } from "../generated/graphql";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
