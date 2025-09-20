import { z } from "zod";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
export const TZ = "Asia/Dhaka" as const;
export const DEFAULT_LOCAL_TIME = "10:00";
const bdPhone = /^(?:\+8801|01)[0-9]{9}$/;
const allowedServiceTypes = ["basic", "premium", "deluxe"] as const;
function todayInTzIsoDate(tz: string): string {
  const now = new Date();
  const local = toZonedTime(now, tz);
  const y = local.getFullYear();
  const m = String(local.getMonth() + 1).padStart(2, "0");
  const d = String(local.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function buildAppointmentUtc(date: string, time: string, tz: string): Date {
  return fromZonedTime(`${date}T${time}:00`, tz);
}
export const createOrderSchema = z
  .object({
    vehicleId: z.uuid({ message: "vehicleId must be a valid UUID" }),
    serviceType: z
      .string()
      .min(1, "serviceType is required")
      .transform(s => s.trim().toLowerCase())
      .refine(s => (allowedServiceTypes as readonly string[]).includes(s), {
        message: `serviceType must be one of: ${allowedServiceTypes.join(", ")}`,
      }),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
      .refine(date => date > todayInTzIsoDate(TZ), {
        message: "appointment date must be at least tomorrow (Asia/Dhaka)",
      }),
    contactInfo: z
      .string()
      .min(3, "contactInfo is required")
      .refine(s => bdPhone.test(s) || s.includes("@"), {
        message: "Provide a valid BD phone (+8801..., 01...) or an email",
      }),
  })
  .transform(input => {
    const appointmentDate = buildAppointmentUtc(
      input.date,
      DEFAULT_LOCAL_TIME,
      TZ
    );
    return {
      vehicleId: input.vehicleId,
      serviceType: input.serviceType,
      appointmentDate,
      contactInfo: input.contactInfo,
    };
  });
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
