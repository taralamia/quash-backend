import type { QueryFailedError } from "typeorm";
export interface PgErrorInfo {
  code?: string;       // e.g. "23505"
  table?: string;      // e.g. "vehicle"
  constraint?: string; // e.g. "uq_vehicle_user_plate"
  schema?: string;     // e.g. "public"
  detail?: string;     // raw pg detail
  column?: string;     // failing column (if provided)
}
/** Minimal, structural view of the node-postgres / TypeORM driver error. */
interface PgDriverErrorShape {
  code?: unknown;
  table?: unknown;
  relation?: unknown;
  constraint?: unknown;
  schema?: unknown;
  detail?: unknown;
  column?: unknown;
}
/** Narrow to a non-null object */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
/** Whether the thrown error looks like TypeORM's QueryFailedError */
function isQueryFailedError(e: unknown): e is QueryFailedError {
  return isRecord(e) && e["name"] === "QueryFailedError";
}
/** Whether the object has a nested `driverError` */
function hasDriverError(e: unknown): e is { driverError: unknown } {
  return isRecord(e) && "driverError" in e;
}
function asPgDriverError(e: unknown): PgDriverErrorShape | undefined {
  return isRecord(e) ? (e as PgDriverErrorShape) : undefined;
}
function asString(x: unknown): string | undefined {
  return typeof x === "string" ? x : undefined;
}
function lc(x: string | undefined): string | undefined {
  return x ? x.toLowerCase() : undefined;
}

/**
 * Normalize a thrown DB error (raw pg or TypeORM-wrapped) into a single shape.
 */
export function pgError(err: unknown): PgErrorInfo {
  // Prefer nested driverError when present (TypeORM's QueryFailedError)
  let driver: unknown = err;
  if (isQueryFailedError(err) && hasDriverError(err)) {
    driver = err.driverError;
  } else if (hasDriverError(err)) {
    driver = err.driverError;
  }
  const d = asPgDriverError(driver);
  const code = asString(d?.code);
  const table = lc(asString(d?.table) ?? asString(d?.relation));
  const constraint = lc(asString(d?.constraint));
  const schema = lc(asString(d?.schema));
  const detail = asString(d?.detail);
  const column = asString(d?.column);

  return { code, table, constraint, schema, detail, column };
}
export const PgCode = {
  UNIQUE_VIOLATION: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
  INVALID_TEXT_REPRESENTATION: "22P02",
  NOT_NULL_VIOLATION: "23502",
  CHECK_VIOLATION: "23514",
} as const;
