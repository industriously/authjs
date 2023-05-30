import { IErrorResponse, IResult } from "../../common";
import { Fetcher } from "../../utils/fetcher";
import { IMeResponse, IOauth2Options, ITokens } from "./interface";

const LOGIN_URL = "https://kauth.kakao.com";
const API_URL = "https://kapi.kakao.com";

export const getLoginUri = (options: IOauth2Options) => {
  const { client_id, redirect_uri, prompt, service_terms, state, nonce } =
    options;
  const path = "/oauth/authorize";
  const search_params = new URLSearchParams({
    client_id,
    redirect_uri,
    ...(prompt ? { prompt } : {}),
    ...(service_terms.length > 0
      ? { service_terms: service_terms.join(",") }
      : {}),
    ...(state ? { state } : {}),
    ...(nonce ? { nonce } : {}),
    response_type: "code"
  }).toString();

  return LOGIN_URL + path + "?" + search_params;
};

export const getTokens =
  ({ client_id, client_secret, redirect_uri }: IOauth2Options) =>
  (code: string): Promise<IResult<ITokens, IErrorResponse>> =>
    Fetcher.post<ITokens>({
      uri: LOGIN_URL + "/oauth/token",
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id,
        redirect_uri,
        code,
        ...(client_secret ? { client_secret } : {})
      }).toString(),
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      status: [200]
    });

export const getMe = (
  access_token: string
): Promise<IResult<IMeResponse, IErrorResponse>> =>
  Fetcher.get<IMeResponse>({
    uri: API_URL + "/v2/user/me",
    headers: { Authorization: `Bearer ${access_token}` },
    status: [200]
  });
