// src/utils/pgErrorClassifier.ts
import { PgCode } from "./pgError";
import type { PgErrorInfo } from "./pgError";
import { TABLE, CONSTRAINT } from "../constants/dbConstraints";
export type DomainError = {
  httpStatus: number;
  code: string;
  message: string;
};
const detailIncludes = (d: string | undefined, frag: string) =>
  !!d && d.includes(frag);

export function classifyPgError(pg: PgErrorInfo): DomainError | null {
  const t = (pg.table ?? "").toLowerCase();
  const c = (pg.constraint ?? "").toLowerCase();
  // 1) UNIQUE violations
  if (pg.code === PgCode.UNIQUE_VIOLATION) {
    if (
      t === TABLE.VEHICLE ||
      c === CONSTRAINT.VEHICLE_UNIQUE_USER_PLATE ||
      detailIncludes(pg.detail, '("userId","licensePlate")')
    ) {
      return {
        httpStatus: 409,
        code: "VEHICLE_DUPLICATE",
        message: "Vehicle already exists for this user",
      };
    }
    if (
      t === TABLE.ORDERS ||
      c === CONSTRAINT.ORDERS_UNIQUE_VEHICLE_APPT ||
      detailIncludes(pg.detail, '("vehicleId","appointmentDate")')
    ) {
      return {
        httpStatus: 409,
        code: "ORDER_SLOT_TAKEN",
        message: "That vehicle is already booked for that time",
      };
    }
    // Unknown unique
    return {
      httpStatus: 409,
      code: "RESOURCE_EXISTS",
      message: "Resource already exists",
    };
  }
  // 2) FK violations
  if (pg.code === PgCode.FOREIGN_KEY_VIOLATION) {
    return {
      httpStatus: 409,
      code: "FK_CONFLICT",
      message: "Referenced resource not found or disallowed",
    };
  }
  // 3) Invalid UUID/text
  if (pg.code === PgCode.INVALID_TEXT_REPRESENTATION) {
    return {
      httpStatus: 400,
      code: "INVALID_ID",
      message: "Invalid ID format",
    };
  }
  if (pg.code === PgCode.NOT_NULL_VIOLATION) {
    return {
      httpStatus: 400,
      code: "MISSING_REQUIRED",
      message: "Required field missing",
    };
  }
  if (pg.code === PgCode.CHECK_VIOLATION) {
    return {
      httpStatus: 400,
      code: "CHECK_FAILED",
      message: "Constraint check failed",
    };
  }

  return null;
}
