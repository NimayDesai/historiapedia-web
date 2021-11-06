import { Box, Button, Flex, Heading, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";

const Login: React.FC<{}> = ({}) => {
  const [login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <>
            <Flex h="800px">
              <Box m="auto" w="500px">
                <Flex align="center" justify="center">
                  <Heading>Sign in to your account</Heading>
                </Flex>
                <Box
                  borderWidth="1px"
                  borderRadius="8px"
                  px="12"
                  py="12"
                  mt="50"
                >
                  <Form>
                    <Stack spacing="6">
                      <InputField
                        name="usernameOrEmail"
                        placeholder="username or email"
                        label="Username or Email"
                      />
                      <Box mt={4}>
                        <InputField
                          name="password"
                          placeholder="password"
                          label="Password"
                          type="password"
                        />
                      </Box>
                      <Button
                        mt={4}
                        type="submit"
                        colorScheme="green"
                        size="lg"
                        isLoading={isSubmitting}
                      >
                        Login
                      </Button>
                    </Stack>
                  </Form>
                </Box>
              </Box>
            </Flex>
          </>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
