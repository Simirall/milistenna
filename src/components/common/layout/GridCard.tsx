import { Card, type ColorScheme, Heading } from "@yamada-ui/react";
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
      p="sm"
      variant="subtle"
    >
      <Heading
        css={{
          overflowWrap: "anywhere",
        }}
        lineBreak="strict"
        wordBreak="normal"
      >
        {title}
      </Heading>
      {children}
      {footer}
    </Card.Root>
  );
};
