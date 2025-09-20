export const TABLE = {
  VEHICLE: "vehicle",
  ORDERS: "orders",
} as const;

export const CONSTRAINT = {
  VEHICLE_UNIQUE_USER_PLATE: "uq_vehicle_user_plate",
  ORDERS_UNIQUE_VEHICLE_APPT: "uq_orders_vehicle_appointment",
} as const;
