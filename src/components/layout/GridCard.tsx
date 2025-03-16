import { Card, type ColorScheme, Heading } from "@yamada-ui/react";
import type { FC, ReactElement } from "react";

export const GridCard: FC<{
  title: string;
  colorScheme: ColorScheme;
  children: ReactElement;
  footer: ReactElement;
}> = ({ title, colorScheme, children, footer }) => {
  return (
    <Card
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
        sx={{
          overflowWrap: "anywhere",
        }}
      >
        {title}
      </Heading>
      {children}
      {footer}
    </Card>
  );
};
