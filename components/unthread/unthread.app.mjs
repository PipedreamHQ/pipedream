import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "unthread",
  propDefinitions: {
    userId: {
      type: "string",
      label: "Assigned To User ID",
      description: "ID of the User to whom the conversation is assigned",
      async options({ prevContext }) {
        const {
          data, cursors,
        } = await this.listUsers({
          data: {
            limit: LIMIT,
            cursor: prevContext.nextCursor,
          },
        });

        return {
          options: data.map(({
            id: value, email: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor: cursors.next,
          },
        };
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "ID of the Customer",
      async options({ prevContext }) {
        const {
          data, cursors,
        } = await this.listCustomers({
          data: {
            limit: LIMIT,
            cursor: prevContext.nextCursor,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor: cursors.next,
          },
        };
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
    },
    slackChannelId: {
      type: "string",
      label: "Slack Channel ID",
      description: "ID the customer's Slack Channel",
    },
    emailDomains: {
      type: "string[]",
      label: "Email Domains",
      description: "Email Domains of the customer, i.e.: `gmail.com`",
    },
    triageChannelId: {
      type: "string",
      label: "Triage Channel ID",
      description: "ID the customer's Triage Channel. [See the documentation](https://docs.unthread.io/account-setup/connect-channels) for further information.",
    },
    disableAutomatedTicketing: {
      type: "boolean",
      label: "Automated Ticketing",
      description: "Disable Automated Ticketing for this customer",
      optional: true,
    },
    defaultTriageChannelId: {
      type: "string",
      label: "Default Triage Channel",
      description: "ID of the default triage Channel of this customer",
      optional: true,
    },
    slackTeamId: {
      type: "string",
      label: "Slack Team ID",
      description: "ID of the Slack Team",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.unthread.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Api-Key": `${this.$auth.api_key}`,
        },
      });
    },
    createConversation(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/conversations",
        ...args,
      });
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/customers",
        ...args,
      });
    },
    updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "patch",
        path: `/customers/${customerId}`,
        ...args,
      });
    },
    deleteCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        path: `/customers/${customerId}`,
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/customers/list",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/users/list",
        ...args,
      });
    },
  },
};
