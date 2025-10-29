import type { ReactNode } from "@tanstack/react-router";
import { Grid } from "@yamada-ui/react";

type GridContainerProps = { children: ReactNode };

export const GridContainer = ({ children }: GridContainerProps) => {
  return (
    <Grid
      gridTemplateColumns="repeat(auto-fit, min(350px, 100%))"
      p="md"
      gap="md"
      justifyContent="space-evenly"
    >
      {children}
    </Grid>
  );
};
