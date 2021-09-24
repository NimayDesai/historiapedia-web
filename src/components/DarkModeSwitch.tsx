import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode, Switch, Box } from "@chakra-ui/react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Box>
      {!isDark ? (
        <SunIcon boxSize="24px" mr={4} />
      ) : (
        <MoonIcon boxSize="24px" mr={4} />
      )}
      <Switch color="green" isChecked={isDark} onChange={toggleColorMode} />
    </Box>
  );
};
