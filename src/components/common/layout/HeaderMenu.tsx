import { DotsNineIcon, MoonStarsIcon, SunDimIcon } from "@phosphor-icons/react";
import { useRouter } from "@tanstack/react-router";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import { useLoginStore } from "@/store/login";

export const HeaderMenu = () => {
  const router = useRouter();
  const { logout, mySelf } = useLoginStore();
  const { toggleColorMode } = useColorMode();

  const { open, onOpen, onClose } = useDisclosure();
  const colorModeButton = useColorModeValue(
    <MoonStarsIcon weight="fill" />,
    <SunDimIcon weight="fill" />,
  );
  const colorModeButtonColor = useColorModeValue("orange.900", "orange.100");

  return (
    <Menu.Root open={open} onOpen={onOpen} onClose={onClose}>
      <Menu.Trigger asChild>
        <IconButton size="lg" borderRadius="full">
          <Avatar
            src={mySelf?.avatarUrl ?? undefined}
            icon={<DotsNineIcon fontSize="1.6rem" />}
            bg="cyan.600"
          />
        </IconButton>
      </Menu.Trigger>
      <Menu.Content as={VStack} alignItems="center">
        {mySelf && (
          <Button
            colorScheme="red"
            onClick={() => {
              logout();
              router.invalidate(); //router contextを初期化　https://tanstack.com/router/latest/docs/framework/react/guide/router-context#invalidating-the-router-context
              onClose();
            }}
          >
            <Text>ログアウト</Text>
          </Button>
        )}
        <IconButton
          borderRadius="full"
          colorScheme="yellow"
          fontSize="2xl"
          color={colorModeButtonColor}
          onClick={() => {
            toggleColorMode();
            onClose();
          }}
        >
          {colorModeButton}
        </IconButton>
      </Menu.Content>
    </Menu.Root>
  );
};
