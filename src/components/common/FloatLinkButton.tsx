import { Plus } from "@phosphor-icons/react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { type ColorScheme, type FC, IconButton } from "@yamada-ui/react";
import type { ReactElement } from "react";

type Position = "right" | "left";

const positionProps: Record<Position, Record<string, string>> = {
  right: {
    right: "xl",
  },
  left: {
    left: "md",
  },
};

export const FloatLinkButton: FC<{
  colorScheme: ColorScheme;
  linkProps: Omit<LinkProps, "mask">;
  position?: Position;
  children?: ReactElement;
}> = ({
  colorScheme,
  position = "right",
  linkProps,
  children = <Plus weight="bold" fontSize="1.6rem" />,
}) => {
  return (
    <IconButton
      as={Link}
      pos="fixed"
      bottom="md"
      {...positionProps[position]}
      borderRadius="full"
      size="xl"
      colorScheme={colorScheme}
      {...linkProps}
    >
      {children}
    </IconButton>
  );
};
