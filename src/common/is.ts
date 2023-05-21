import { IResult, IOk, IError } from "./result.interface";

export const isOk = <T, E>(input: IResult<T, E>): input is IOk<T> =>
  input.type === "ok";

export const isError = <T, E>(input: IResult<T, E>): input is IError<E> =>
  input.type === "error";
