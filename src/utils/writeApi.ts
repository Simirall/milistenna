import type {
  Endpoints,
  SwitchCaseResponseType,
} from "misskey-js/api.types.d.ts";
import { getApiUrl } from "./getApiUrl";
import { getFetchObject } from "./getFetchObject";

export type WriteApiErrorKind = "network" | "http" | "invalid-json";

type WriteApiErrorOptions = {
  cause?: unknown;
  status?: number;
};

export class WriteApiError extends Error {
  readonly endpoint: keyof Endpoints;
  readonly kind: WriteApiErrorKind;
  readonly status?: number;

  constructor(
    endpoint: keyof Endpoints,
    kind: WriteApiErrorKind,
    options: WriteApiErrorOptions = {},
  ) {
    super(buildMessage(endpoint, kind, options.status), {
      cause: options.cause,
    });
    this.name = "WriteApiError";
    this.endpoint = endpoint;
    this.kind = kind;
    this.status = options.status;
  }
}

const buildMessage = (
  endpoint: keyof Endpoints,
  kind: WriteApiErrorKind,
  status?: number,
) => {
  if (kind === "http") {
    return `API request failed: ${endpoint} (status: ${status})`;
  }
  if (kind === "invalid-json") {
    return `Invalid JSON response: ${endpoint}`;
  }
  return `Network error: ${endpoint}`;
};

export const writeApi = async <
  TEndpoint extends keyof Endpoints,
  TPayload extends Endpoints[TEndpoint]["req"],
>(
  endpoint: TEndpoint,
  payload: TPayload,
): Promise<SwitchCaseResponseType<TEndpoint, TPayload>> => {
  let response: Response;

  try {
    response = await fetch(getApiUrl(endpoint), getFetchObject(payload));
  } catch (cause) {
    throw new WriteApiError(endpoint, "network", { cause });
  }

  if (!response.ok) {
    throw new WriteApiError(endpoint, "http", {
      status: response.status,
    });
  }

  const text = await response.text();

  if (!text) {
    return undefined as SwitchCaseResponseType<TEndpoint, TPayload>;
  }

  try {
    return JSON.parse(text) as SwitchCaseResponseType<TEndpoint, TPayload>;
  } catch (cause) {
    throw new WriteApiError(endpoint, "invalid-json", { cause });
  }
};
