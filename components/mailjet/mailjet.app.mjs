import MailjetClient from "node-mailjet";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mailjet",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Unique numeric ID of the contact you want to update.",
      async options({
        page, prevContext,
      }) {
        const limit = 2;
        const { body } =
          await this.listContacts({
            params: {
              Limit: limit,
              Offset: prevContext.offset,
            },
          });
        const { Data: contacts } = body;
        const options = contacts.map(({
          ID, Email,
        }) => ({
          label: Email,
          value: ID,
        }));
        return {
          options,
          context: {
            offset: (page + 1) * limit,
          },
        };
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "User-selected name for this contact.",
      optional: true,
    },
    isExcludedFromCampaigns: {
      type: "boolean",
      label: "Is Excluded From Campaigns",
      description: "Indicates whether the contact is added to the exclusion list for campaigns or not. An excluded contact will not be receiving any marketing emails.",
      optional: true,
    },
  },
  methods: {
    client() {
      return new MailjetClient({
        apiKey: this.$auth.public_key,
        apiSecret: this.$auth.secret_key,
      });
    },
    async createContact({ data } = {}) {
      return this.client()
        .post(constants.MODEL.CONTACT, constants.REQUEST_OPTIONS_V3)
        .request(data);
    },
    async updateContact({
      contactId, data,
    } = {}) {
      return this.client()
        .put(constants.MODEL.CONTACT, constants.REQUEST_OPTIONS_V3)
        .id(contactId)
        .request(data);
    },
    async listContacts({ params } = {}) {
      return this.client()
        .get(constants.MODEL.CONTACT, constants.REQUEST_OPTIONS_V3)
        .request(params);
    },
    async sendMessage({ data } = {}) {
      return this.client()
        .post(constants.MODEL.SEND, constants.REQUEST_OPTIONS_V3)
        .request(data);
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = 1000,
      lastResourceProperty,
      done,
    }) {
      let offset = resourceFnArgs.params?.Offset || 0;
      let limit = resourceFnArgs.params?.Limit || 100;
      let resourcesCount = 0;

      while (true) {
        const { body: nextResponse } =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              Offset: offset,
              Limit: limit,
            },
          });

        if (!nextResponse) {
          throw new Error("No response from MailJet API");
        }

        let nextResources = nextResponse.Data;
        offset += limit;

        for (const resource of nextResources) {
          const isDone = done && done({
            lastResourceProperty,
            resource,
          });

          if (isDone) {
            return;
          }

          yield resource;
          resourcesCount += 1;
        }

        if (nextResponse.Count < limit || (max && resourcesCount >= max)) {
          return;
        }
      }
    },
  },
};
