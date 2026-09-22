// x-pd-ai: optimized
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import Bottleneck from "bottleneck";
import {
  DEFAULT_CALLS_LIMIT,
  DEFAULT_CONTACTS_LIMIT,
  DEFAULT_CONVERSATIONS_LIMIT,
  DEFAULT_MESSAGES_LIMIT,
  DEFAULT_TASKS_LIMIT,
  DEFAULT_USERS_LIMIT,
  MAX_CONTACTS_LIMIT,
  MAX_LIMIT,
  MAX_USERS_LIMIT,
  MIN_LIMIT,
} from "./common/constants.mjs";
const limiter = new Bottleneck({
  minTime: 100, // 10 requests per seconds (https://www.openphone.com/docs/mdx/api-reference/rate-limits)
  maxConcurrent: 1,
});
const axiosRateLimiter = limiter.wrap(axios);

// axios's default query-param serialization emits `key[]=value` for arrays, which the
// OpenPhone API rejects ("Expected array") — confirmed against the live API that it
// wants bare repeated keys instead (`key=value1&key=value2`).
function serializeParams(params) {
  const search = new URLSearchParams();
  for (const [
    key,
    value,
  ] of Object.entries(params ?? {})) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, item);
    } else {
      search.append(key, value);
    }
  }
  return search.toString();
}

export default {
  type: "app",
  app: "openphone",
  propDefinitions: {
    from: {
      type: "string",
      label: "From",
      description: "The sender's phone number. Can be either your OpenPhone phone number ID or the full phone number in E.164 format.",
      async options() {
        const { data } = await this.listPhoneNumbers();
        return data?.map(({
          id: value, name, formattedNumber,
        }) => ({
          label: name && formattedNumber
            ? `${name} - ${formattedNumber}`
            : value,
          value,
        })) || [];
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The contact's company name",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The contact's role",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Array of objects of contact's emails. **Example:** `{\"name\": \"Company Email\", \"value\": \"abc@example.com\"}`",
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Array of objects of contact's phone numbers. **Example:** `{\"name\": \"Company Phone\", \"value\": \"+12345678901\"}`",
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of objects of custom fields for the contact. **Example:** `{\"key\": \"inbound-lead\", \"value\": [\"option1\", \"option2\"]}`",
    },
    phoneNumberId: {
      type: "string",
      label: "Phone Number ID",
      description: "The OpenPhone phone number ID (format `PN...`). Run the **List Phone Numbers** action to find valid IDs.",
    },
    callParticipant: {
      type: "string",
      label: "Participant",
      description: "Phone number, in E.164 format (e.g. `+15551234567`), to filter calls by. This endpoint accepts exactly one participant (confirmed against the live API — it's a required field, not optional).",
    },
    messageParticipants: {
      type: "string[]",
      label: "Participants",
      description: "Participant phone number(s) in E.164 format (e.g. `+15551234567`). Max 10 participants. Required by this endpoint.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Optional OpenPhone user ID (format `US...`) to filter by. Run the **List Users** action to find user IDs.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Optional ISO 8601 timestamp; only return results created after this time (e.g. `2026-08-01T00:00:00Z`).",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Optional ISO 8601 timestamp; only return results created before this time (e.g. `2026-08-31T23:59:59Z`).",
      optional: true,
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation (format `CN...`). Run the **List Conversations** action to find conversation IDs (or the **List Messages** action, which returns each message's `conversationId`).",
    },
    callMaxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of calls to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_CALLS_LIMIT}.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      default: DEFAULT_CALLS_LIMIT,
      optional: true,
    },
    conversationMaxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of conversations to return per page. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_CONVERSATIONS_LIMIT}.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      default: DEFAULT_CONVERSATIONS_LIMIT,
      optional: true,
    },
    messageMaxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of messages to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_MESSAGES_LIMIT}.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      default: DEFAULT_MESSAGES_LIMIT,
      optional: true,
    },
    taskMaxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of tasks to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_TASKS_LIMIT}.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      default: DEFAULT_TASKS_LIMIT,
      optional: true,
    },
    contactMaxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of contacts to return per page. Min ${MIN_LIMIT}, max ${MAX_CONTACTS_LIMIT}. Defaults to ${DEFAULT_CONTACTS_LIMIT}.`,
      min: MIN_LIMIT,
      max: MAX_CONTACTS_LIMIT,
      default: DEFAULT_CONTACTS_LIMIT,
      optional: true,
    },
    userMaxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of users to return per page. Min ${MIN_LIMIT}, max ${MAX_USERS_LIMIT}. Defaults to ${DEFAULT_USERS_LIMIT}.`,
      min: MIN_LIMIT,
      max: MAX_USERS_LIMIT,
      default: DEFAULT_USERS_LIMIT,
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "Pagination token (`nextPageToken` from a previous response) to fetch the next page of results. If `nextPageToken` is present in a response, call this action again with `pageToken` set to that value to fetch more results.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of fields to include in each returned record (e.g. `[\"id\", \"createdAt\"]`). When omitted, the full record is returned.",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task (format `TK...`). Run the **List Tasks** action to find task IDs.",
    },
    externalIds: {
      type: "string[]",
      label: "External IDs",
      description: "Optional list of unique identifiers from an external system used to retrieve specific contacts. These must match the `externalId` values supplied when the contacts were created via **Create a Contact**. When omitted, all contacts for the organization are returned.",
      optional: true,
    },
    sources: {
      type: "string[]",
      label: "Sources",
      description: "Optional list of sources to filter by, indicating how the contact was created or where it originated from.",
      optional: true,
    },
    conversationPhoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Optional list of OpenPhone phone numbers to filter by. Each item can be either an OpenPhone phone number ID or a full phone number in E.164 format. Run the **List Phone Numbers** action to find valid IDs.",
      optional: true,
    },
    excludeInactive: {
      type: "boolean",
      label: "Exclude Inactive",
      description: "Exclude inactive conversations from the results.",
      optional: true,
    },
    updatedAfter: {
      type: "string",
      label: "Updated After",
      description: "Optional ISO 8601 timestamp; only return results updated after this time (e.g. `2026-08-01T00:00:00Z`).",
      optional: true,
    },
    updatedBefore: {
      type: "string",
      label: "Updated Before",
      description: "Optional ISO 8601 timestamp; only return results updated before this time (e.g. `2026-08-31T23:59:59Z`).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.openphone.com/v1";
    },
    _headers() {
      return {
        Authorization: `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      try {
        return await axiosRateLimiter($, {
          url: this._baseUrl() + path,
          headers: this._headers(),
          paramsSerializer: serializeParams,
          ...opts,
        });
      } catch ({ response }) {
        const errorMessage = response?.data?.errors
          ? `Prop: ${response.data.errors[0].path} - ${response.data.errors[0].message}`
          : response?.data?.message;

        const error = new ConfigurationError(errorMessage);
        // Preserved so callers can distinguish "not found yet" (e.g. a call summary
        // that hasn't been generated) from a real failure (auth, rate limit, 5xx).
        error.status = response?.status;
        throw error;
      }
    },
    listPhoneNumbers(opts = {}) {
      return this._makeRequest({
        path: "/phone-numbers",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listConversations(opts = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...opts,
      });
    },
    createWebhook({
      webhookType, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/webhooks/${webhookType}`,
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    sendTextMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    listCalls(opts = {}) {
      return this._makeRequest({
        path: "/calls",
        ...opts,
      });
    },
    getCall({
      callId, ...opts
    }) {
      return this._makeRequest({
        path: `/calls/${callId}`,
        ...opts,
      });
    },
    getCallSummary({
      callId, ...opts
    }) {
      return this._makeRequest({
        path: `/calls/${callId}/summary`,
        ...opts,
      });
    },
    getCallTranscript({
      callId, ...opts
    }) {
      return this._makeRequest({
        path: `/calls/${callId}/transcript`,
        ...opts,
      });
    },
    listMessages(opts = {}) {
      return this._makeRequest({
        path: "/messages",
        ...opts,
      });
    },
    updateConversationStatus({
      conversationId, subPath, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${conversationId}/${subPath}`,
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        ...opts,
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...opts,
      });
    },
    updateTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tasks/${taskId}`,
        ...opts,
      });
    },
    deleteTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/tasks/${taskId}`,
        ...opts,
      });
    },
    deleteContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
  },
};
