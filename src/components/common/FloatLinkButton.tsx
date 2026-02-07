import { PlusIcon } from "@phosphor-icons/react";
import { Link, type LinkProps } from "@tanstack/react-router";
import {
  type ColorScheme,
  IconButton,
  type ResponsiveObject,
} from "@yamada-ui/react";
import type { ReactElement } from "react";

type Position = "right" | "left";

const positionProps: Record<
  Position,
  Record<string, ResponsiveObject<string | number>>
> = {
  left: {
    left: { base: "calc(20vw + 1rem)", md: "xl" },
  },
  right: {
    right: { base: "calc(20vw + 1rem)", md: "xl" },
  },
};

type FloatLinkButtonProps = {
  colorScheme: ColorScheme;
  linkProps: LinkProps;
  position?: Position;
  children?: ReactElement;
};

export const FloatLinkButton = ({
  colorScheme,
  position = "right",
  linkProps,
  children = <PlusIcon fontSize="1.6rem" weight="bold" />,
}: FloatLinkButtonProps) => {
  return (
    <IconButton
      as={Link}
      bottom="xl"
      pos="fixed"
      {...positionProps[position]}
      borderRadius="full"
      colorScheme={colorScheme}
      shadow="md"
      size="xl"
      {...(linkProps as Record<string, unknown>)}
    >
      {children}
    </IconButton>
  );
};
