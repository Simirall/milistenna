export const DEFAULT_CACHE_TIME = 1000 * 60 * 5; // 5分
export const DEFAULT_RETRY_COUNT = 2;

export const defaultQueryConfig = {
  retry: DEFAULT_RETRY_COUNT,
  staleTime: DEFAULT_CACHE_TIME,
};
