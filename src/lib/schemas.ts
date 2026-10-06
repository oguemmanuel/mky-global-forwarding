import { z } from "zod";

export const modes = ["vehicle", "cargo", "road", "documents"] as const;
export const vehicleTypes = ["car", "van", "suv", "truck", "trailer", "motorbike", "other"] as const;
export const documentTypes = ["mrn", "eur1", "acid", "other"] as const;

const optionalText = z.string().trim().optional().or(z.literal(""));
const optionalNumber = z.coerce.number().min(0).optional();

export const quoteSchema = z
  .object({
    mode: z.enum(modes),
    channel: z.enum(["email", "whatsapp"]).default("email"),
    documents: z.array(z.enum(documentTypes)).default([]),
    incoterm: z.string().max(3).optional().or(z.literal("")),
    origin: z.string().trim().min(2, "Enter the port or city of collection"),
    destination: z.string().trim().min(2, "Enter the destination port or city"),
    readyDate: optionalText,
    collection: z.enum(["yes", "no"]).default("no"),
    // Vehicles
    vehicleType: z.enum(vehicleTypes).optional(),
    vehicleCount: z.coerce.number().int().min(0).optional(),
    makeModel: optionalText,
    vins: z.string().trim().max(2000).optional().or(z.literal("")),
    running: z.enum(["yes", "no"]).optional(),
    // Cargo
    goods: optionalText,
    hsCode: z.string().trim().max(14).optional().or(z.literal("")),
    equipment: optionalText,
    pieces: optionalNumber,
    weightKg: optionalNumber,
    lengthCm: optionalNumber,
    widthCm: optionalNumber,
    heightCm: optionalNumber,
    dangerous: z.boolean().default(false),
    // Contact
    name: z.string().trim().min(2, "Enter your name"),
    company: optionalText,
    email: z.string().trim().email("Enter a valid email address"),
    phone: optionalText,
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
    // Honeypot: real users never fill this
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((q, ctx) => {
    const need = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (q.mode === "vehicle" || q.mode === "road") {
      if (!q.vehicleType) need("vehicleType", "Choose the vehicle type");
      if (!q.vehicleCount || q.vehicleCount < 1) need("vehicleCount", "Enter how many vehicles");
      if (!q.makeModel || q.makeModel.length < 2) need("makeModel", "Enter the make and model, e.g. Toyota Corolla 2021");
    }
    if (q.mode === "cargo") {
      if (!q.goods || q.goods.length < 2) need("goods", "Describe the goods briefly");
      if (!q.pieces || q.pieces < 1) need("pieces", "Enter the number of pieces");
      if (!q.weightKg || q.weightKg <= 0) need("weightKg", "Enter the total weight in kg");
    }
    if (q.mode === "documents" && q.documents.length === 0) need("documents", "Choose at least one document");
  });

export type QuoteInput = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  topic: z.enum(["shipment", "new-business", "customs", "partnership", "other"]),
  message: z.string().trim().min(10, "Write a short message (10 characters or more)"),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Flatten zod issues into { field: message } for the form UI */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
