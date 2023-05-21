export type IResult<T, E> = Ok<T> | Error<E>;

export interface Ok<T> {
  readonly type: "ok";
  readonly result: T;
}

export interface Error<E> {
  readonly type: "error";
  readonly result: E;
}
