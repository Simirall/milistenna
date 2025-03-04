import type { Error as MkError } from "misskey-js/entities.js";

export const isError = (result: unknown | MkError): result is MkError => {
  return (result as MkError)?.error !== undefined;
};
