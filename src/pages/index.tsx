import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

import { patientFormSchema, type PatientFormData } from "@/lib/schema";
import { FileUpload } from "@/components/FileUpload";
import { createApolloClient } from "@/lib/apollo-client";
import { CREATE_PATIENT_PROFILE } from "@/lib/graphql/queries";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function IntakePage() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    setSubmitting(true);
    try {
      // Convert both files to base64 in parallel
      const [insuranceCardUrl, photoIdUrl] = await Promise.all([
        fileToBase64(data.insuranceCard),
        fileToBase64(data.photoId),
      ]);

      // Call GraphQL mutation
      const client = createApolloClient();
      await client.mutate({
        mutation: CREATE_PATIENT_PROFILE,
        variables: {
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
            address: data.address,
            insuranceCardUrl,
            photoIdUrl,
          },
        },
      });

      toast.success("Patient profile created successfully!");
      reset();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Patient Intake Form</title>
      </Head>

      <div className="page-container">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Patient Intake</h1>
            <p className="page-subtitle">
              Please fill out the form below to register as a new patient.
            </p>
          </div>
          <Link href="/admin" className="btn-secondary text-xs">
            Admin
          </Link>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="card mt-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                id="firstName"
                {...register("firstName")}
                className="form-input"
                placeholder="Jane"
              />
              {errors.firstName && (
                <p className="form-error">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                id="lastName"
                {...register("lastName")}
                className="form-input"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="form-error">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="form-input"
                placeholder="jane@example.com"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className="form-input"
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="form-error">{errors.phone.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="form-input"
              />
              {errors.dateOfBirth && (
                <p className="form-error">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                id="address"
                {...register("address")}
                className="form-input"
                placeholder="123 Main St, City, State, ZIP"
              />
              {errors.address && (
                <p className="form-error">{errors.address.message}</p>
              )}
            </div>

            {/* Insurance Card */}
            <FileUpload
              label="Insurance Card"
              accept="image/jpeg,image/png,image/webp"
              error={errors.insuranceCard?.message}
              onChange={(file) =>
                setValue("insuranceCard", file as File, {
                  shouldValidate: true,
                })
              }
            />

            {/* Photo ID */}
            <FileUpload
              label="Photo ID"
              accept="image/jpeg,image/png,image/webp"
              error={errors.photoId?.message}
              onChange={(file) =>
                setValue("photoId", file as File, { shouldValidate: true })
              }
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary min-w-[140px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
