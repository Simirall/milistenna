import { Text } from "@yamada-ui/react";

type ApiErrorMessageProps = {
  message?: string;
};

/** API失敗時にユーザー向けメッセージを表示する */
export const ApiErrorMessage = ({ message }: ApiErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return <Text color="error">エラー: {message}</Text>;
};
