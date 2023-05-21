import fetch from "node-fetch";
import { IResult } from "../common/result.interface";

export namespace Fetcher {
  export const get = async <T>({
    uri,
    headers = {}
  }: {
    uri: string;
    headers?: Record<string, string>;
  }): Promise<IResult<T, string>> => {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "User-Agent": "request",
        ...headers
      }
    });
    if (response.status !== 200 && response.status !== 201)
      return { type: "error", result: await response.text() };

    return {
      type: "ok",
      result: (await response.json()) as T
    };
  };

  export const post = async <T>({
    uri,
    body,
    headers = {}
  }: {
    uri: string;
    body: object | string;
    headers?: Record<string, string>;
  }): Promise<IResult<T, string>> => {
    const response = await fetch(uri, {
      body: typeof body === "string" ? body : JSON.stringify(body),
      headers: {
        "User-Agent": "request",
        ...headers
      }
    });
    if (response.status !== 200 && response.status !== 201)
      return { type: "error", result: await response.text() };

    return {
      type: "ok",
      result: (await response.json()) as T
    };
  };
}
