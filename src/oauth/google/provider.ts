import { decode } from "jsonwebtoken";
import { IResult } from "../../common/result.interface";
import { Fetcher } from "../../utils/fetcher";
import { IIdToken, IOauth2Options, ITokens } from "./interface";

const LOGIN_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKENS_URL = "https://oauth2.googleapis.com/token";
// const API_URL = "https://people.googleapis.com";

export const getLoginUri = (options: IOauth2Options): string => {
  const {
    client_id,
    redirect_uri,
    scope,
    access_type = "online",
    include_granted_scopes = true,
    prompt
  } = options;
  const scope_string = scope.join(" ");
  const searchObject = {
    client_id,
    redirect_uri,
    scope: scope_string,
    response_type: "code",
    access_type,
    include_granted_scopes: include_granted_scopes ? "true" : "false",
    ...(prompt ? { prompt } : {})
  };
  const search = new URLSearchParams(Object.entries(searchObject)).toString();
  return LOGIN_URL + "?" + search;
};

export const getTokens =
  ({ client_id, client_secret, redirect_uri }: IOauth2Options) =>
  (code: string) =>
    Fetcher.post<ITokens>({
      uri: TOKENS_URL,
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: "authorization_code"
      }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

export const getUserProfile = <S extends "email" | "profile" | "">({
  id_token
}: {
  id_token?: string;
}): IResult<IIdToken<S>, string> => {
  if (id_token === undefined) {
    return { type: "error", result: "Can Not Find Id Token" };
  }
  const result = decode(id_token, {
    complete: false,
    json: true
  }) as IIdToken<S> | null;

  if (result === null)
    return { type: "error", result: "Fail to Decode Id Token" };

  return { type: "ok", result };
};
