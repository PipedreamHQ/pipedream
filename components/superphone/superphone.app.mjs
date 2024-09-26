import "graphql/language/index.js";
import { GraphQLClient } from "graphql-request";
import constants from "./common/constants.mjs";
import contact from "./common/queries/contact.mjs";
import conversation from "./common/queries/conversation.mjs";

export default {
  type: "app",
  app: "superphone",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to retrieve.",
      async options({ prevContext }) {
        if (prevContext.nextCursor === null) {
          return [];
        }
        const {
          contacts: {
            nodes,
            pageInfo: {
              hasNextPage,
              endCursor,
            },
          },
        } = await this.listContacts({
          first: constants.DEFAULT_LIMIT,
          after: prevContext.nextCursor,
        });

        const options = nodes.map(({
          id: value, firstName, email,
        }) => ({
          label: `${firstName} ${
            email !== null
              ? "<" + email + ">"
              : ""
          }`.trim(),
          value,
        }));

        return {
          options,
          context: {
            nextCursor: hasNextPage
              ? endCursor
              : null,
          },
        };
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation to retrieve.",
      async options({ prevContext }) {
        if (prevContext.nextCursor === null) {
          return [];
        }
        const {
          conversations: {
            nodes,
            pageInfo: {
              hasNextPage,
              endCursor,
            },
          },
        } = await this.listConversations({
          first: constants.DEFAULT_LIMIT,
          after: prevContext.nextCursor,
        });

        const options = nodes.map(({
          id: value, participant: label,
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            nextCursor: hasNextPage
              ? endCursor
              : null,
          },
        };
      },
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message to retrieve.",
      async options({
        conversationId, prevContext,
      }) {
        if (prevContext.nextCursor === null) {
          return [];
        }

        const {
          conversation: {
            messages: {
              nodes,
              pageInfo: {
                hasNextPage,
                endCursor,
              },
            },
          },
        } = await this.getConversation({
          id: conversationId,
          first: constants.DEFAULT_LIMIT,
          after: prevContext.nextCursor,
        });

        const options = nodes.map(({
          to: value, body: label,
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            nextCursor: hasNextPage
              ? endCursor
              : null,
          },
        };
      },
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The contact's mobile number in E.164 format.",
      optional: true,
      async options({ prevContext }) {
        if (prevContext.nextCursor === null) {
          return [];
        }
        const {
          contacts: {
            nodes,
            pageInfo: {
              hasNextPage,
              endCursor,
            },
          },
        } = await this.listContacts({
          first: constants.DEFAULT_LIMIT,
          after: prevContext.nextCursor,
        });

        const options = nodes
          .filter(({ mobile }) => mobile)
          .map(({
            mobile: value, firstName: label,
          }) => ({
            label,
            value,
          }));

        return {
          options,
          context: {
            nextCursor: hasNextPage
              ? endCursor
              : null,
          },
        };
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name for the contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name for the contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address.",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "The contact's birthday.",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "The contact's Twitter username.",
      optional: true,
    },
    instagram: {
      type: "string",
      label: "Instagram",
      description: "The contact's Instagram username.",
      optional: true,
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "The contact's LinkedIn username.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The contact's job title.",

      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The contact's country code.",
      optional: true,
    },
    province: {
      type: "string",
      label: "Province",
      description: "The contact's province code.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The contact's city.",
      optional: true,
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "The contact's zip code.",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      const baseUrl = `${constants.BASE_URL}${constants.VERSION_PATH}`;
      return baseUrl.replace(constants.ENVIRONMENT_PLACEHOLDER, this.$auth.environment);
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    getClient() {
      return new GraphQLClient(this.getBaseUrl(), {
        headers: this.getHeaders(),
      });
    },
    makeRequest({
      query, variables,
    } = {}) {
      return this.getClient().request(query, variables);
    },
    listContacts(variables = {}) {
      return this.makeRequest({
        query: contact.queries.listContacts,
        variables,
      });
    },
    listConversations(variables = {}) {
      return this.makeRequest({
        query: conversation.queries.listConversations,
        variables,
      });
    },
    getConversation(variables = {}) {
      return this.makeRequest({
        query: conversation.queries.getConversation,
        variables,
      });
    },
  },
};
