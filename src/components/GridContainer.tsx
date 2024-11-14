import type { ReactNode } from "@tanstack/react-router";
import { Grid } from "@yamada-ui/react";
import type { FC } from "react";

export const GridContainer: FC<{ children: ReactNode }> = ({ children }) => {
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
