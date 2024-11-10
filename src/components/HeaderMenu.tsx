import { useLoginStore } from "@/store/login";
import { useMySelfStore } from "@/store/user";
import { DotsNine, MoonStars, SunDim } from "@phosphor-icons/react";
import { useRouter } from "@tanstack/react-router";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  VStack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@yamada-ui/react";

export const HeaderMenu = () => {
  const router = useRouter();
  const { mySelf } = useMySelfStore();
  const { logout } = useLoginStore();
  const { toggleColorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const colorModeButton = useColorModeValue(
    <MoonStars weight="fill" />,
    <SunDim weight="fill" />,
  );
  const colorModeButtonColor = useColorModeValue("orange.900", "orange.100");

  return (
    <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <MenuButton as={IconButton} size="lg" borderRadius="full">
        <Avatar
          src={mySelf?.avatarUrl ?? undefined}
          icon={<DotsNine fontSize="1.6rem" />}
          bg="cyan.600"
        />
      </MenuButton>
      <MenuList as={VStack} alignItems="center">
        {mySelf && (
          <Button
            colorScheme="red"
            onClick={() => {
              logout();
              router.invalidate(); //router contextを初期化　https://tanstack.com/router/latest/docs/framework/react/guide/router-context#invalidating-the-router-context
              onClose();
            }}
          >
            ログアウト
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
      </MenuList>
    </Menu>
  );
};
