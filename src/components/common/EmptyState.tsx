import { MinusCircle } from "@phosphor-icons/react";
import {
  EmptyStateIndicator,
  EmptyStateTitle,
  EmptyState as YmdEmptyState,
} from "@yamada-ui/react";
import type { FC, ReactElement } from "react";

export const EmptyState: FC<{
  icon?: ReactElement;
  title?: string;
  children?: ReactElement;
}> = ({ icon = <MinusCircle />, title, children }) => {
  return (
    <YmdEmptyState>
      <EmptyStateIndicator>{icon}</EmptyStateIndicator>
      {title && <EmptyStateTitle>{title}</EmptyStateTitle>}
      {children}
    </YmdEmptyState>
  );
};
