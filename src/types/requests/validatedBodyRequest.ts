import { Request } from "express";

export type ValidatedBodyRequest<T> = Request & {
  body: T;
};
