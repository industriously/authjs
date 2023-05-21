import { JwtExtractorFromExpressRequest } from "./interface";

export namespace JwtExtractFrom {
  export const Header =
    (key: string): JwtExtractorFromExpressRequest =>
    (req) => {
      const value = req.headers[key.toLowerCase()];
      if (typeof value !== "string") return { type: "error", result: null };
      return { type: "ok", result: value };
    };

  export const Body =
    (key: string): JwtExtractorFromExpressRequest =>
    (req) => {
      const body = req.body;
      if (body == null) return { type: "error", result: null };
      if (typeof body !== "object") return { type: "error", result: null };

      const value = body[key] as unknown;
      if (typeof value !== "string") return { type: "error", result: null };
      return { type: "ok", result: value };
    };

  export const Query =
    (key: string): JwtExtractorFromExpressRequest =>
    (req) => {
      const value = req.query[key];
      if (typeof value !== "string") return { type: "error", result: null };
      return { type: "ok", result: value };
    };

  export const Cookie =
    (key: string): JwtExtractorFromExpressRequest =>
    (req) => {
      const cookies = req.cookies;
      if (cookies == null) return { type: "error", result: null };
      if (typeof cookies !== "object") return { type: "error", result: null };

      const value = cookies[key] as unknown;
      if (typeof value !== "string") return { type: "error", result: null };
      return { type: "ok", result: value };
    };

  export const AuthorizationHeader =
    (token_type: string): JwtExtractorFromExpressRequest =>
    (req) => {
      const regex = new RegExp(`^${token_type}\\s+\\S+`, "i");
      const line = req.headers["authorization"];
      if (line === undefined) return { type: "error", result: null };

      const token = line.match(regex)?.[0].split(/\s+/)[1];
      return typeof token === "undefined"
        ? { type: "error", result: null }
        : { type: "ok", result: token };
    };

  export const AuthorizationHeaderAsBearer = AuthorizationHeader("bearer");
}
