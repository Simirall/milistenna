import { DotsNineIcon, MoonStarsIcon, SunDimIcon } from "@phosphor-icons/react";
import { useRouter } from "@tanstack/react-router";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  Select,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@yamada-ui/react";
import { FONT_OPTIONS, type FontValue, useFontStore } from "@/store/font";
import { useLoginStore } from "@/store/login";

export const HeaderMenu = () => {
  const router = useRouter();
  const { logout, mySelf } = useLoginStore();
  const { toggleColorMode } = useColorMode();
  const { fontValue, setFont } = useFontStore();

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
      <Menu.Content alignItems="center" gap="md" p="md">
        {mySelf && (
          <Button
            colorScheme="red"
            onClick={() => {
              logout();
              router.invalidate(); //router contextを初期化　https://tanstack.com/router/latest/docs/framework/react/guide/router-context#invalidating-the-router-context
              onClose();
              location.reload();
            }}
          >
            <Text>ログアウト</Text>
          </Button>
        )}
        <Box w="full">
          <Text>フォント</Text>
          <Select.Root
            size="sm"
            value={fontValue}
            width="full"
            onChange={(e) => setFont(e as FontValue)}
          >
            {FONT_OPTIONS.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Root>
        </Box>
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
