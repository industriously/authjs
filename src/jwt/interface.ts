import { IResult } from "../common/result.interface";
import Express from "express";

export type JwtExtractorFromExpressRequest = (
  req: Express.Request<
    Record<string, string>,
    unknown,
    unknown,
    Record<string, string | string[] | undefined>,
    Record<string, unknown>
  >
) => IResult<string, null>;
