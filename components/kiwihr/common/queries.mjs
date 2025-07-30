import { gql } from "graphql-request";

const listUsers = gql`
  query listUsers($offset: Int, $limit: Int, $sort: [SortArgInput!], $filter: UserFilterInput) {
    users(offset: $offset, limit: $limit, sort: $sort, filter: $filter) {
        items {
          id
          firstName
          lastName
          email
          gender
          workPhones
          employmentStartDate
          employmentEndDate
          aboutMe
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
  }
`;

const listManagers = gql`
  query listManagers($offset: Int, $limit: Int, $sort: [SortArgInput!], $filter: AvailableManagersFilterInput) {
    availableManagers(offset: $offset, limit: $limit, sort: $sort, filter: $filter) {
        items {
          id
          firstName
          lastName
          email
          isActive
        }
    }
  }
`;

const listTeams = gql`
  query listTeams($offset: Int, $limit: Int, $sort: [SortArgInput!]) {
    teams(offset: $offset, limit: $limit, sort: $sort) {
        items {
          id
          name
        }
    }
  }
`;

const listPositions = gql`
  query listPositions($offset: Int, $limit: Int, $sort: [SortArgInput!]) {
    positions(offset: $offset, limit: $limit, sort: $sort) {
        items {
          id
          name
        }
    }
  }
`;

const listLocations = gql`
  query listLocations($offset: Int, $limit: Int, $sort: [SortArgInput!]) {
    locations(offset: $offset, limit: $limit, sort: $sort) {
        items {
          id
          name
        }
    }
  }
`;

export default {
  listUsers,
  listManagers,
  listTeams,
  listPositions,
  listLocations,
};
