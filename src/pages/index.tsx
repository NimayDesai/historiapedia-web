import {
  ArrowForwardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { useCommentsQuery } from "../generated/graphql";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";
import { LikeSection } from "../components/LikeSection";

const Index = () => {
  return (
    <Layout>
      <Flex mx="auto" align="center" w="100%" maxW={800} mt={100}>
        <Stack textAlign="center">
          <Heading fontSize="6xl">
            Find all of your history needs in one place
          </Heading>
          <br />
          <Text fontSize="xl" mx="auto" color="gray">
            HistoriaPedia is a curated history resource from all time periods
            for school or if you are just curious and just want to learn
            something new.
          </Text>
          <br />
          <Box align="center" pb="50px">
            <NextLink href="/register">
              <Button
                as={Link}
                size="lg"
                colorScheme="green"
                mr={8}
                rightIcon={<ArrowForwardIcon />}
              >
                Get Started
              </Button>
            </NextLink>

            <Button as={Link} isExternal size="lg" colorScheme="gray">
              Source Code
            </Button>
          </Box>
          <Divider />
          <Heading fontSize="6xl" pt="50px">
            Features
          </Heading>
          <Heading fontSize="3xl" pt="50px">
            Every time era
          </Heading>

          <Text fontSize="xl" color="gray">
            HistoriaPedia provides history from all places around the world and
            all time eras. Stop going from website to website for your history
            projects. HistoriaPedia has it all
          </Text>
          <br />
          <Heading fontSize="3xl" pt="50px">
            Sort by grade
          </Heading>

          <Text fontSize="xl" color="gray">
            HistoriaPedia can sort by grade in the Canadian Curriculum
          </Text>
        </Stack>
      </Flex>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
