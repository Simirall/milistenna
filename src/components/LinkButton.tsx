import { Link, type LinkProps } from "@tanstack/react-router";
import { Button, type ButtonProps, type FC } from "@yamada-ui/react";
import type { ReactNode } from "react";

export const LinkButton: FC<{
  children: ReactNode;
  linkProps: Omit<LinkProps, "mask">;
  buttonProps?: ButtonProps;
}> = ({ children, linkProps, buttonProps }) => {
  return (
    <Button as={Link} {...linkProps} {...buttonProps}>
      {children}
    </Button>
  );
};
