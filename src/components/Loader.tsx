import { Center, Loading } from "@yamada-ui/react";

export const Loader = () => {
  return (
    <Center p="4">
      <Loading fontSize="6xl" variant="puff" colorScheme="sky" />
    </Center>
  );
};
