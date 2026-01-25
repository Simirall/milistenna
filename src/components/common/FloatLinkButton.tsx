import { Plus } from "@phosphor-icons/react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { type ColorScheme, IconButton } from "@yamada-ui/react";
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

type FloatLinkButtonProps = {
  colorScheme: ColorScheme;
  linkProps: Omit<LinkProps, "mask">;
  position?: Position;
  children?: ReactElement;
};

export const FloatLinkButton = ({
  colorScheme,
  position = "right",
  linkProps,
  children = <Plus weight="bold" fontSize="1.6rem" />,
}: FloatLinkButtonProps) => {
  return (
    <IconButton
      pos="fixed"
      bottom="md"
      {...positionProps[position]}
      borderRadius="full"
      size="xl"
      colorScheme={colorScheme}
    >
      <Link {...linkProps}>{children}</Link>
    </IconButton>
  );
};
