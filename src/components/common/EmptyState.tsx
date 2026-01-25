import { MinusCircle } from "@phosphor-icons/react";
import { EmptyState as YmdEmptyState } from "@yamada-ui/react";
import type { ReactElement } from "react";

type EmptyStateProps = {
  icon?: ReactElement;
  title?: string;
  children?: ReactElement;
};

export const EmptyState = ({
  icon = <MinusCircle />,
  title,
  children,
}: EmptyStateProps) => {
  return (
    <YmdEmptyState.Root>
      <YmdEmptyState.Indicator>{icon}</YmdEmptyState.Indicator>
      {title && <YmdEmptyState.Title>{title}</YmdEmptyState.Title>}
      {children}
    </YmdEmptyState.Root>
  );
};
