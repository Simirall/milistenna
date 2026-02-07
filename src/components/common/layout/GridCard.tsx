import { Card, type ColorScheme } from "@yamada-ui/react";
import type { ReactElement } from "react";

type GridCardProps = {
  title: string;
  colorScheme: ColorScheme;
  children: ReactElement;
  footer: ReactElement;
};

export const GridCard = ({
  title,
  colorScheme,
  children,
  footer,
}: GridCardProps) => {
  return (
    <Card.Root
      colorScheme={colorScheme}
      display="grid"
      gridRow="span 3"
      gridTemplateRows="subgrid"
      p="md"
      variant="subtle"
    >
      <Card.Header
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        fontWeight="bold"
      >
        {title}
      </Card.Header>
      <Card.Body flex={1} overflow="auto">
        {children}
      </Card.Body>
      <Card.Footer>{footer}</Card.Footer>
    </Card.Root>
  );
};
