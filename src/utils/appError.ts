import { WriteApiError } from "@/utils/writeApi";

const DEFAULT_ERROR_MESSAGE =
  "処理に失敗しました。時間をおいてから再度お試しください。";

const WRITE_API_ERROR_MESSAGES = {
  http: "サーバーで処理に失敗しました。時間をおいてから再度お試しください。",
  "invalid-json":
    "サーバー応答の解析に失敗しました。時間をおいてから再度お試しください。",
  network: "通信に失敗しました。ネットワークを確認してから再度お試しください。",
} as const;

/** ユーザー向けに表示するエラーメッセージを返す */
export const getUserErrorMessage = (
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGE,
): string => {
  if (error instanceof WriteApiError) {
    return WRITE_API_ERROR_MESSAGES[error.kind] ?? fallback;
  }

  if (error instanceof Error && error.message.trim()) {
    return fallback;
  }

  return fallback;
};

/** 内部追跡向けに詳細エラーを記録する */
export const reportInternalError = (context: string, error: unknown): void => {
  console.error(`[${context}]`, error);
};
