import { z } from "zod";
export const normalizePlate = (s: string) => s.trim().toUpperCase();
export const createVehicleSchema = z.object({
  licensePlate: z.string().trim().min(1, "licensePlate is required").max(64).transform(normalizePlate),
  make: z.string().trim().max(64).optional(),
  model: z.string().trim().max(64).optional(),
  color: z.string().trim().max(32).optional(),
});
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export const updateVehicleSchema = createVehicleSchema.partial();
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
