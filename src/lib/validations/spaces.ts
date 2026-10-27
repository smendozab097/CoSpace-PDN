import { z } from "zod";

export const spaceTypeEnum = z.enum(["DESK", "MEETING_ROOM", "CABIN"]);

export const createSpaceSchema = z.object({
  name: z.string().min(3, "El nombre del espacio debe tener al menos 3 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
  type: spaceTypeEnum,
  capacity: z.number().int().positive("La capacidad debe ser un número entero positivo"),
  pricePerHour: z.number().positive("El precio por hora debe ser mayor a 0"),
  imageUrl: z
    .string()
    .url({ message: "La URL de la imagen debe ser válida" })
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;
