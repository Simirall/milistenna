import { Link } from "@tanstack/react-router";
import { Box, Heading, HStack, useColorModeValue } from "@yamada-ui/react";
import { appName } from "@/constants/appName";
import { HeaderMenu } from "./HeaderMenu";

export const Header = () => {
  const bg = useColorModeValue(
    "transparentize(sky.400, 50%)",
    "transparentize(sky.900, 70%)",
  );

  return (
    <Box
      backdropFilter="blur(8px) saturate(1.5)"
      bg={bg}
      pos="sticky"
      px={{ base: "20vw", md: "md" }}
      py="sm"
      top="0"
      zIndex="1"
    >
      <HStack justifyContent="space-between">
        <Heading as={Link} to="/" truncated>
          {appName}
        </Heading>
        <HeaderMenu />
      </HStack>
    </Box>
  );
};
