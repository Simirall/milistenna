import { MinusCircle } from "@phosphor-icons/react";
import {
  EmptyStateIndicator,
  EmptyStateTitle,
  EmptyState as YmdEmptyState,
} from "@yamada-ui/react";
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
    <YmdEmptyState>
      <EmptyStateIndicator>{icon}</EmptyStateIndicator>
      {title && <EmptyStateTitle>{title}</EmptyStateTitle>}
      {children}
    </YmdEmptyState>
  );
};
