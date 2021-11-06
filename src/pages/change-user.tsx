import { useApolloClient } from "@apollo/client";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useChangeUserMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

interface ChangeUserProps {}

const ChangeUser: React.FC<ChangeUserProps> = ({}) => {
  const [changeUser] = useChangeUserMutation();
  const apolloClient = useApolloClient();

  useIsAuth();

  const placeholder = "Leave blank if you want it to be the same";

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changeUser({
            variables: { options: values },
          });
          if (response.data?.changeUser.errors) {
            setErrors(toErrorMap(response.data.changeUser.errors));
          } else {
            await apolloClient.resetStore();
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder={placeholder}
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="email"
                placeholder={placeholder}
                label="Email"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder={placeholder}
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="green"
              isLoading={isSubmitting}
            >
              Update Info
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangeUser);
