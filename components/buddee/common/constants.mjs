export const BASE_URL = "https://api.buddee.nl";

export const API_ENDPOINTS = {
  EMPLOYEES: "/employees",
  LEAVE_REQUESTS: "/leave-requests",
  TIME_REGISTRATIONS: "/time-registrations",
  LEAVE_TYPES: "/leave-types",
  CONTRACTS: "/contracts",
  SALARIES: "/salaries",
  POSITIONS: "/positions",
  LOCATIONS: "/locations",
  USERS: "/users",
  ORGANISATION_USERS: "/organisation-users",
};

export const LEAVE_REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

export const DEFAULT_PAGINATION = {
  LIMIT: 100,
  MAX_LIMIT: 1000,
  OFFSET: 0,
};

export const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
};
