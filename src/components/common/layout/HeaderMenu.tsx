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
    <Menu.Root onClose={onClose} onOpen={onOpen} open={open}>
      <Menu.Trigger asChild>
        <IconButton borderRadius="full" size="lg">
          <Avatar
            bg="cyan.600"
            icon={<DotsNineIcon fontSize="1.6rem" />}
            src={mySelf?.avatarUrl ?? undefined}
          />
        </IconButton>
      </Menu.Trigger>
      <Menu.Content alignItems="center" as={VStack}>
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
          color={colorModeButtonColor}
          colorScheme="yellow"
          fontSize="2xl"
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
