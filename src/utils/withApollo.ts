import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { PaginatedArticles, PaginatedComments } from "../generated/graphql";
import { createWithApollo } from "./createWithApollo";

const createClient = (ctx: NextPageContext | undefined) =>
  new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            comments: {
              keyArgs: [],
              merge(
                existing: PaginatedComments | undefined,
                incoming: PaginatedComments
              ): PaginatedComments {
                return {
                  ...incoming,
                  comments: [
                    ...(existing?.comments || []),
                    ...incoming.comments,
                  ],
                };
              },
            },
            articles: {
              keyArgs: [],
              merge(
                existing: PaginatedArticles | undefined,
                incoming: PaginatedArticles
              ): PaginatedArticles {
                return {
                  ...incoming,
                  articles: [
                    ...(existing?.articles || []),
                    ...incoming.articles,
                  ],
                };
              },
            },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
