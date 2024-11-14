import { Plus } from "@phosphor-icons/react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { type ColorScheme, type FC, IconButton } from "@yamada-ui/react";

export const FloatLinkButton: FC<{
  colorScheme: ColorScheme;
  linkProps: Omit<LinkProps, "mask">;
}> = ({ colorScheme, linkProps }) => {
  return (
    <IconButton
      as={Link}
      pos="fixed"
      bottom="md"
      right="md"
      borderRadius="full"
      size="xl"
      colorScheme={colorScheme}
      {...linkProps}
    >
      <Plus weight="bold" fontSize="1.6rem" />
    </IconButton>
  );
};
