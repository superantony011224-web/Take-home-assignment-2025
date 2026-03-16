export const typeDefs = `#graphql
  type PatientProfile {
    id: String!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    dateOfBirth: String!
    address: String!
    insuranceCardUrl: String
    photoIdUrl: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getPatientProfiles: [PatientProfile!]!
  }

  input CreatePatientProfileInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    dateOfBirth: String!
    address: String!
    insuranceCardUrl: String
    photoIdUrl: String
  }

  type Mutation {
    createPatientProfile(input: CreatePatientProfileInput!): PatientProfile!
  }
`;
