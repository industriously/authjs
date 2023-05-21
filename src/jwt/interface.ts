import { Request } from "express";
import { IResult } from "../common/result.interface";

export type JwtExtractorFromExpressRequest = (
  req: Request
) => IResult<string, null>;
