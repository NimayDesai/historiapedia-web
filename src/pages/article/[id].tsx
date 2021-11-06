import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { LikeSection } from "../../components/LikeSection";
import {
  useArticleQuery,
  useCommentsQuery,
  useCreateCommentMutation,
} from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";

interface articleProps {}

const Article: React.FC<articleProps> = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const { data, loading } = useArticleQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });

  const [createComment] = useCreateCommentMutation();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.article) {
    return (
      <Layout>
        <div>
          Could not find that article it may be deleted by the site or the user
          who had made it
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading>Article: {data?.article?.title}</Heading>
      <br />
      <Text>{data?.article?.text}</Text>
      <Heading mt={8}>Comments</Heading>
      <br />
      <Heading size="md" mt={10}>
        New comment
      </Heading>
      <br />
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { errors } = await createComment({
            variables: {
              title: values.title,
              text: values.text,
              articleId: data.article!.id,
            },
            update: (cache) => {
              cache.evict({ fieldName: "article" });
            },
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <InputField name="title" placeholder="Title" label="Title" />
              <Box mt={4}>
                <InputField
                  name="text"
                  placeholder="Text"
                  label="Text"
                  textarea
                />
                <Button
                  mt={4}
                  type="submit"
                  colorScheme="green"
                  isLoading={isSubmitting}
                >
                  New Comment
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      <br />
      {!data.article.comments && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data.article?.comments.map((p) => (
            <>
              <Flex key={p.id} p={5}>
                <LikeSection comment={p} />
                <Box>
                  <Heading fontSize="xl" textAlign="left">
                    {p.title}
                  </Heading>
                  <Text textAlign="left" mt={4}>
                    Commented by: {p.creator.username}
                  </Text>
                  <Text textAlign="left" mt={4}>
                    {p.textSnippet}
                  </Text>
                </Box>
              </Flex>
              <Divider />
            </>
          ))}
        </Stack>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Article);
