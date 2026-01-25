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
      display="grid"
      p="sm"
      gridTemplateRows="subgrid"
      gridRow="span 3"
      colorScheme={colorScheme}
      variant="subtle"
    >
      <Heading
        wordBreak="normal"
        lineBreak="strict"
        css={{
          overflowWrap: "anywhere",
        }}
      >
        {title}
      </Heading>
      {children}
      {footer}
    </Card.Root>
  );
};
