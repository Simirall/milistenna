import { Link, type LinkProps } from "@tanstack/react-router";
import { Button, type ButtonProps } from "@yamada-ui/react";
import type { ReactNode } from "react";

type LinkButtonProps = {
  children: ReactNode;
  linkProps: Omit<LinkProps, "mask">;
  buttonProps?: ButtonProps;
};

export const LinkButton = ({
  children,
  linkProps,
  buttonProps,
}: LinkButtonProps) => {
  return (
    <Button as={Link} {...linkProps} {...buttonProps}>
      {children}
    </Button>
  );
};
