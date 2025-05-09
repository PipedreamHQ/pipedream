import { gql } from "graphql-request";

const createEmployee = gql`
  mutation createEmployee($user: CreateUserInput!) {
    createUser(user: $user) {
        id
        firstName
        lastName
        email
        gender
        workPhones
        employmentStartDate
        employmentEndDate
        aboutMe
        employeeNumber
        birthDate
        personalEmail
        invitationStatus
        language
        isActive
        nationality
        personalPhone
        pronouns
    }
  }
`;

const updateEmployee = gql`
  mutation updateEmployee($id: ID!, $user: UpdateUserInput!) {
    updateUser(id: $id, user: $user) {
        id
        firstName
        lastName
        email
        gender
        workPhones
        employmentStartDate
        employmentEndDate
        aboutMe
        employeeNumber
        birthDate
        personalEmail
        invitationStatus
        language
        isActive
        nationality
        personalPhone
        pronouns
    }
  }
`;

export default {
  createEmployee,
  updateEmployee,
};
