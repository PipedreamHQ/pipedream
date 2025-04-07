import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import Bottleneck from "bottleneck";
const limiter = new Bottleneck({
  minTime: 100, // 10 requests per seconds (https://www.openphone.com/docs/mdx/api-reference/rate-limits)
  maxConcurrent: 1,
});
const axiosRateLimiter = limiter.wrap(axios);

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
          ...opts,
        });
      } catch ({ response }) {
        const errorMessage = response?.data?.errors
          ? `Prop: ${response.data.errors[0].path} - ${response.data.errors[0].message}`
          : response?.data?.message;

        throw new ConfigurationError(errorMessage);
      }
    },
    listPhoneNumbers(opts = {}) {
      return this._makeRequest({
        path: "/phone-numbers",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/calls",
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
  },
};
