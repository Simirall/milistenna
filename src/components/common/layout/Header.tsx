import { Link } from "@tanstack/react-router";
import { Heading, HStack, useColorModeValue } from "@yamada-ui/react";
import { appName } from "@/constants/appName";
import { HeaderMenu } from "./HeaderMenu";

export const Header = () => {
  const bg = useColorModeValue(
    "transparentize(sky.400, 50%)",
    "transparentize(sky.900, 70%)",
  );

  return (
    <HStack
      pos="sticky"
      top="0"
      justifyContent="space-between"
      zIndex="1"
      px="md"
      py="sm"
      bg={bg}
      backdropFilter="blur(8px) saturate(1.5)"
    >
      <Heading as={Link} to="/" truncated>
        {appName}
      </Heading>
      <HeaderMenu />
    </HStack>
  );
};
