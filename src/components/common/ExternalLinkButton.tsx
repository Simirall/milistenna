import { Button, type ButtonProps } from "@yamada-ui/react";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";

export const ExternalLinkButton = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: string;
} & ButtonProps) => {
  return (
    <Button
      size="lg"
      gap="xs"
      variant="surface"
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...(props as Record<string, unknown>)}
    >
      {children}
      <ArrowSquareOutIcon fontSize="1.4em" />
    </Button>
  );
};
