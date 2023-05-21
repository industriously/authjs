import { Fetcher } from "../../utils/fetcher";
import { IEmail, IOauth2Options, ITokens, IUser } from "./interface";

const LOGIN_URL = "https://github.com/login/oauth/authorize";
const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const API_BASE = "https://api.github.com";

export const getLoginUri = (options: IOauth2Options): string => {
  const {
    client_id,
    client_secret,
    redirect_uri,
    scope,
    allow_signup = true
  } = options;
  return (
    LOGIN_URL +
    "?" +
    new URLSearchParams([
      ["client_id", client_id],
      ["client_secret", client_secret],
      ["redirect_uri", redirect_uri],
      ["allow_signup", allow_signup + ""],
      ["scope", scope.join(" ")]
    ]).toString()
  );
};

export const getTokens = (options: IOauth2Options) => (code: string) =>
  Fetcher.post<ITokens>({
    uri: ACCESS_TOKEN_URL,
    body: {
      client_id: options.client_id,
      client_secret: options.client_secret,
      code
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

export const api =
  <T>(path: string) =>
  (access_token: string) =>
    Fetcher.get<T>({
      uri: API_BASE + path,
      headers: {
        Authorization: "Bearer " + access_token,
        Accept: "application/vnd.github+json",
        "X-Github-Api-Version": "2022-11-28"
      }
    });

export const getUser = api<IUser>("/user");

export const getEmails = api<IEmail[]>("/user/emails");
