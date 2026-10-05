import { z } from "zod";

export const modes = ["air", "sea", "road"] as const;

export const quoteSchema = z.object({
  mode: z.enum(modes),
  incoterm: z.string().max(3).optional().or(z.literal("")),
  customs: z.enum(["yes", "no", "unsure"]),
  origin: z.string().trim().min(2, "Enter a pickup city and country"),
  destination: z.string().trim().min(2, "Enter a delivery city and country"),
  readyDate: z.string().optional().or(z.literal("")),
  serviceLevel: z.enum(["door-door", "door-port", "port-door", "port-port"]),
  goods: z.string().trim().min(2, "Describe the goods briefly"),
  hsCode: z.string().trim().max(14).optional().or(z.literal("")),
  equipment: z.string().optional().or(z.literal("")),
  pieces: z.coerce.number({ error: "Enter the number of pieces" }).int().min(1, "At least 1 piece"),
  weightKg: z.coerce.number({ error: "Enter the total weight in kg" }).positive("Enter the total weight in kg"),
  lengthCm: z.coerce.number().min(0).optional(),
  widthCm: z.coerce.number().min(0).optional(),
  heightCm: z.coerce.number().min(0).optional(),
  dangerous: z.boolean().default(false),
  name: z.string().trim().min(2, "Enter your name"),
  company: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot: real users never fill this
  website: z.string().max(0).optional().or(z.literal("")),
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
