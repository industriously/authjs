import { Fetcher } from "../../utils/fetcher";
import {
  IMeRequestParameter,
  IMeResponse,
  IOauth2Options,
  ITokens
} from "./interface";

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
  (code: string) =>
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
      }
    });

export const getMe =
  ({ secure_resource, property_keys }: IMeRequestParameter) =>
  (access_token: string) =>
    Fetcher.post<IMeResponse>({
      uri: API_URL + "/v2/user/me",
      body: new URLSearchParams({
        grant_type: "authorization_code",
        secure_resource: secure_resource ? "true" : "false",
        property_keys: JSON.stringify(property_keys)
      }).toString(),
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${access_token}`
      }
    });
