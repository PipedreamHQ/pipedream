export const BASE_URL = "https://api.linkupapi.com/v2";

export const ENDPOINTS = {
  LOGIN: "/login",
  CHECKPOINT: "/checkpoint",
  ACCOUNTS: "/accounts",
  PROFILES: "/profiles",
  MESSAGES: "/messages",
  NETWORK: "/network",
  CONTENT: "/content",
};

export const ACTIONS = {
  GET: "get",
  SEARCH_PEOPLE: "search_people",
  SEARCH_COMPANIES: "search_companies",
  GET_COMPANY: "get_company",
  INVITE: "invite",
  LIST_INVITATIONS: "list_invitations",
  SEND: "send",
  GET_CONVERSATION: "get_conversation",
  LIST_INBOX: "list_inbox",
  COMMENT: "comment",
};

export const DEFAULT_PLATFORM = "linkedin";

// Max accounts the List Accounts endpoint returns per page (GET /accounts `limit`).
export const ACCOUNTS_MAX_PAGE_SIZE = 500;
