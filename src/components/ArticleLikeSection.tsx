import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import {
  ArticleSnippetFragment,
  ArticleVoteMutation,
  CommentSnippetFragment,
  CommentsQuery,
  useArticleVoteMutation,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";

interface ArticleLikeSectionProps {
  article: ArticleSnippetFragment;
}

const updateAfterVote = (
  value: number,
  articleId: number,
  cache: ApolloCache<ArticleVoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number;
  }>({
    id: "Article:" + articleId,
    fragment: gql`
      fragment _ on Article {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPointsValue =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Article:" + articleId,
      fragment: gql`
        fragment __ on Article {
          points
          voteStatus
        }
      `,
      data: { id: articleId, points: newPointsValue, voteStatus: value },
    });
  }
};

export const ArticleLikeSection: React.FC<ArticleLikeSectionProps> = ({
  article,
}) => {
  const [articleVote] = useArticleVoteMutation();
  return (
    <Flex direction="column" justify="center" align="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (article.voteStatus === 1) {
            return;
          }
          await articleVote({
            variables: {
              articleId: article.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, article.id, cache),
          });
        }}
        aria-label="Like"
        colorScheme={article.voteStatus === 1 ? "green" : undefined}
        icon={<ChevronUpIcon />}
      />
      {article.points}
      <IconButton
        onClick={async () => {
          if (article.voteStatus === -1) {
            return;
          }
          await articleVote({
            variables: {
              articleId: article.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, article.id, cache),
          });
        }}
        aria-label="Dislike"
        colorScheme={article.voteStatus === -1 ? "red" : undefined}
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
