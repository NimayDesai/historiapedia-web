import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import {
  CommentSnippetFragment,
  CommentsQuery,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";

interface LikeSectionProps {
  comment: CommentSnippetFragment;
}

const updateAfterVote = (
  value: number,
  commentId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number;
  }>({
    id: "Comment:" + commentId,
    fragment: gql`
      fragment _ on Comment {
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
      id: "Comment:" + commentId,
      fragment: gql`
        fragment __ on Comment {
          points
          voteStatus
        }
      `,
      data: { id: commentId, points: newPointsValue, voteStatus: value },
    });
  }
};

export const LikeSection: React.FC<LikeSectionProps> = ({ comment }) => {
  const [vote] = useVoteMutation();
  return (
    <Flex direction="column" justify="center" align="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (comment.voteStatus === 1) {
            return;
          }
          await vote({
            variables: {
              commentId: comment.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, comment.id, cache),
          });
        }}
        aria-label="Like"
        colorScheme={comment.voteStatus === 1 ? "green" : undefined}
        icon={<ChevronUpIcon />}
      />
      {comment.points}
      <IconButton
        onClick={async () => {
          if (comment.voteStatus === -1) {
            return;
          }
          await vote({
            variables: {
              commentId: comment.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, comment.id, cache),
          });
        }}
        aria-label="Dislike"
        colorScheme={comment.voteStatus === -1 ? "red" : undefined}
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
