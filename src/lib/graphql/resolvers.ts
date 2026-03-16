import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
    getPatientProfiles: async () => {
      return prisma.patientProfile.findMany({
        orderBy: { createdAt: "desc" },
      });
    },
  },
  Mutation: {
    createPatientProfile: async (
      _: unknown,
      { input }: { input: Prisma.PatientProfileCreateInput }
    ) => {
      return prisma.patientProfile.create({ data: input });
    },
  },
};
