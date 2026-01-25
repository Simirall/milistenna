import { Grid } from "@yamada-ui/react";
import type { ReactNode } from "react";

type GridContainerProps = { children: ReactNode };

export const GridContainer = ({ children }: GridContainerProps) => {
  return (
    <Grid
      gap="md"
      gridTemplateColumns="repeat(auto-fit, min(350px, 100%))"
      justifyContent="space-evenly"
      p="md"
    >
      {children}
    </Grid>
  );
};
