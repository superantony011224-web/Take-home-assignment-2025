import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "File must be under 10 MB.")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .png, and .webp files are accepted."
  );

export const patientFormSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email."),
  phone: z.string().min(1, "Phone number is required."),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime()) && d < new Date();
    }, "Date of birth must be in the past."),
  address: z.string().min(1, "Address is required."),
  insuranceCard: imageFileSchema,
  photoId: imageFileSchema,
});

export type PatientFormData = z.infer<typeof patientFormSchema>;
