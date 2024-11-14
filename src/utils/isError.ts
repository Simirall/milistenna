import type { Error as MkError } from "misskey-js/entities.js";

export const isError = (result: unknown | MkError): result is MkError => {
  return (result as MkError).error !== undefined;
};

export const isNotError = <T>(result: T | MkError): result is T => {
  return (result as MkError).error === undefined;
};
