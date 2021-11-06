import { Box, Button, Flex, Heading, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";

interface registerProps {}

const register: React.FC<registerProps> = ({}) => {
  const [register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Flex h="800px">
            <Box m="auto" w="500px">
              <Flex align="center" justify="center">
                <Heading>Register a new account</Heading>
              </Flex>
              <Box borderWidth="1px" borderRadius="8px" px="12" py="12" mt="50">
                <Form>
                  <Stack spacing="6">
                    <InputField
                      name="username"
                      placeholder="username"
                      label="Username"
                    />
                    <Box mt={4}>
                      <InputField
                        name="email"
                        placeholder="email"
                        label="Email"
                      />
                    </Box>
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
                      size="lg"
                      type="submit"
                      colorScheme="green"
                      isLoading={isSubmitting}
                    >
                      Register
                    </Button>
                  </Stack>
                </Form>
              </Box>
            </Box>
          </Flex>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(register);
