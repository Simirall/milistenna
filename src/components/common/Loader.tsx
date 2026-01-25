import { Center, Loading } from "@yamada-ui/react";

export const Loader = () => {
  return (
    <Center p="4">
      <Loading.Puff fontSize="6xl" colorScheme="sky" />
    </Center>
  );
};
