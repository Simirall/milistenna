import { Center, Loading } from "@yamada-ui/react";

export const Loader = () => {
  return (
    <Center p="4">
      <Loading.Puff colorScheme="sky" fontSize="6xl" />
    </Center>
  );
};
