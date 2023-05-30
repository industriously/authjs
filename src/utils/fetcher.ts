import fetch from "node-fetch";
import { IResult } from "../common/result.interface";
import { IErrorResponse } from "../common";

export namespace Fetcher {
  export const get = async <T>({
    uri,
    headers = {},
    status = [200]
  }: {
    uri: string;
    headers?: Record<string, string>;
    status?: number[];
  }): Promise<IResult<T, IErrorResponse>> => {
    try {
      const response = await fetch(uri, {
        method: "GET",
        headers: {
          "User-Agent": "request",
          ...headers
        }
      });
      if (!status.includes(response.status))
        return {
          type: "error",
          result: { status: response.status, rawbody: await response.text() }
        };

      return {
        type: "ok",
        result: (await response.json()) as T
      };
    } catch (error: unknown) {
      return {
        type: "error",
        result: {
          status: 500,
          rawbody: error instanceof Error ? error.message : ""
        }
      };
    }
  };

  export const post = async <T>({
    uri,
    body,
    headers = {},
    status = [201]
  }: {
    uri: string;
    body: object | string;
    headers?: Record<string, string>;
    status?: number[];
  }): Promise<IResult<T, IErrorResponse>> => {
    try {
      const response = await fetch(uri, {
        method: "POST",
        body: typeof body === "string" ? body : JSON.stringify(body),
        headers: {
          "User-Agent": "request",
          ...headers
        }
      });
      if (!status.includes(response.status))
        return {
          type: "error",
          result: { status: response.status, rawbody: await response.text() }
        };

      return {
        type: "ok",
        result: (await response.json()) as T
      };
    } catch (error: unknown) {
      return {
        type: "error",
        result: {
          status: 500,
          rawbody: error instanceof Error ? error.message : ""
        }
      };
    }
  };
}
