import { gql } from "@apollo/client";

export const CREATE_PATIENT_PROFILE = gql`
  mutation CreatePatientProfile($input: CreatePatientProfileInput!) {
    createPatientProfile(input: $input) {
      id
    }
  }
`;

export const GET_PATIENT_PROFILES = gql`
  query GetPatientProfiles {
    getPatientProfiles {
      id
      firstName
      lastName
      email
      phone
      dateOfBirth
      address
      insuranceCardUrl
      photoIdUrl
      createdAt
    }
  }
`;
