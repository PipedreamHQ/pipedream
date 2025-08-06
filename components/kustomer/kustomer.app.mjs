import { axios } from "@pipedream/platform";
import {
  DEFAULT_LANG_OPTIONS,
  DIRECTION_OPTIONS,
  GENDER_OPTIONS,
  LIMIT,
  SENTIMENT_OPTIONS,
  STATUS_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "kustomer",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Unique identifier for the customer",
      async options({ page }) {
        const { data } = await this.listCustomers({
          params: {
            page: page + 1,
            pageSize: LIMIT * page,
          },
        });

        return data.map(({
          id: value, attributes: { displayName: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the conversation",
      async options({ page }) {
        const { data } = await this.listTags({
          params: {
            page: page + 1,
            pageSize: LIMIT * page,
          },
        });
        return data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    assignedUsers: {
      type: "string[]",
      label: "Assigned Users",
      description: "Users assigned to the conversation",
      async options({ page }) {
        const { data } = await this.listUsers({
          params: {
            page: page + 1,
            pageSize: LIMIT * page,
          },
        });
        return data.map(({
          id: value, attributes: { displayName: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    assignedTeams: {
      type: "string[]",
      label: "Assigned Teams",
      description: "Teams assigned to the resource",
      async options({ page }) {
        const { data } = await this.listTeams({
          params: {
            page: page + 1,
            pageSize: LIMIT * page,
          },
        });
        return data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    queueId: {
      type: "string",
      label: "Queue Id",
      description: "Queue ID assigned to the conversation",
      async options({ page }) {
        const { data } = await this.listQueues({
          params: {
            page: page + 1,
            pageSize: LIMIT * page,
          },
        });
        return data.map(({
          id: value, attributes: { displayName: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "Unique identifier for the conversation",
      async options({ page }) {
        const { data } = await this.listConversations({
          params: {
            page: page + 1,
            pageSize: LIMIT * page,
          },
        });
        return data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    klassName: {
      type: "string",
      label: "Klass Name",
      description: "Klass name of the KObjects (custom objects)",
      async options({ page }) {
        const { data } = await this.listKlasses({
          params: {
            page: page + 1,
            pageSize: LIMIT * page,
          },
        });
        return data.map(({
          attributes: {
            name: value, displayName: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    customObjectId: {
      type: "string",
      label: "Custom Object ID",
      description: "The ID of the custom object to retrieve",
      async options({
        page, klassName,
      }) {
        const { data } = await this.listCustomObjects({
          klassName,
          params: {
            page: page + 1,
            pageSize: LIMIT * page,
          },
        });
        return data.map(({
          id: value, attributes: { title: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "External identifier",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the conversation",
      options: STATUS_OPTIONS,
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Priority level (1-5)",
      min: 1,
      max: 5,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Direction of the conversation",
      options: DIRECTION_OPTIONS,
    },
    sentimentPolarity: {
      type: "string",
      label: "Sentiment Polarity",
      description: "Sentiment polarity associated with the conversation",
      options: SENTIMENT_OPTIONS,
    },
    sentimentConfidence: {
      type: "string",
      label: "Sentiment Confidence",
      description: "Sentiment confidence associated with the conversation",
      options: SENTIMENT_OPTIONS,
    },
    defaultLang: {
      type: "string",
      label: "Default Language",
      description: "Default language for the customer",
      options: DEFAULT_LANG_OPTIONS,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the customer",
    },
    username: {
      type: "string",
      label: "Username",
      description: "Username of the customer",
    },
    avatarUrl: {
      type: "string",
      label: "Avatar URL",
      description: "URL to the avatar",
    },
    externalIds: {
      type: "string[]",
      label: "External IDs",
      description: "External identifiers",
    },
    sharedExternalIds: {
      type: "string[]",
      label: "Shared External IDs",
      description: "Shared external identifiers",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Emails of the customer",
    },
    sharedEmails: {
      type: "string[]",
      label: "Shared Emails",
      description: "Shared emails",
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "Phone numbers of the customer",
    },
    sharedPhones: {
      type: "string[]",
      label: "Shared Phones",
      description: "Shared phone numbers",
    },
    whatsApps: {
      type: "string[]",
      label: "WhatsApps",
      description: "WhatsApp numbers of the customer",
    },
    urls: {
      type: "string[]",
      label: "URLs",
      description: "Associated URLs",
    },
    birthdayAt: {
      type: "string",
      label: "Birthday At",
      description: "A valid [ISO 8601](https://pt.wikipedia.org/wiki/ISO_8601) date/time",
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Gender of the customer",
      options: GENDER_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.api.kustomerapp.com/v1`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createConversation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/conversations",
        ...opts,
      });
    },
    updateConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/conversations/${conversationId}`,
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    updateCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
    listConversations(opts = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listQueues(opts = {}) {
      return this._makeRequest({
        path: "/routing/queues",
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        path: "/teams",
        ...opts,
      });
    },
    listKlasses(opts = {}) {
      return this._makeRequest({
        path: "/klasses",
        ...opts,
      });
    },
    listCustomObjects({
      klassName, ...opts
    }) {
      return this._makeRequest({
        path: `/klasses/${klassName}`,
        ...opts,
      });
    },
    getCustomObjectById({
      klassName,
      customObjectId,
      ...opts
    }) {
      return this._makeRequest({
        path: `/klasses/${klassName}/${customObjectId}`,
        ...opts,
      });
    },
    getCustomObjectByExternalId({
      klassName,
      externalId,
      ...opts
    }) {
      return this._makeRequest({
        path: `/klasses/${klassName}/externalId=${externalId}`,
        ...opts,
      });
    },
    updateCustomObjectById({
      klassName,
      customObjectId,
      ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/klasses/${klassName}/${customObjectId}`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/outbound-webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/outbound-webhooks/${webhookId}`,
      });
    },
  },
};
