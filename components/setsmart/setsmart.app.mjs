import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "setsmart",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the SetSmart contact (conversation). You can find it with the **Find Contact** action.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact, in international format (e.g. `+14155550100`)",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
      optional: true,
    },
    instagramUsername: {
      type: "string",
      label: "Instagram Username",
      description: "Instagram username of the contact, with or without the leading `@`",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Name of the tag",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Note to append to the contact",
    },
    assistantId: {
      type: "string",
      label: "Assistant ID",
      description: "The ID of the AI assistant to assign to this contact. Defaults to the workspace's default assistant.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://setsmart.io/api";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        ...opts,
      });
    },
    listAnsweredLeads(opts = {}) {
      return this._makeRequest({
        path: "/answered",
        ...opts,
      });
    },
    listQualifiedLeads(opts = {}) {
      return this._makeRequest({
        path: "/ok-call",
        ...opts,
      });
    },
    findContact(opts = {}) {
      return this._makeRequest({
        path: "/find-contact",
        ...opts,
      });
    },
    importContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/import-contact",
        ...opts,
      });
    },
    addTag(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/add-tag-to-conversation",
        ...opts,
      });
    },
    removeTag(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/remove-tag-from-conversation",
        ...opts,
      });
    },
    addNotes(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/add-notes",
        ...opts,
      });
    },
    setBooked(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/set-booked",
        ...opts,
      });
    },
    turnAiOn(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/set-ai-on",
        ...opts,
      });
    },
    turnAiOff(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/set-ai-off",
        ...opts,
      });
    },
    sendTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send-template",
        ...opts,
      });
    },
    listScheduledMessages(opts = {}) {
      return this._makeRequest({
        path: "/list-scheduled",
        ...opts,
      });
    },
    cancelScheduledMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/cancel-scheduled",
        ...opts,
      });
    },
  },
};
