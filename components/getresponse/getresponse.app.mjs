import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "getresponse",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The campaign ID",
      async options({
        query, page,
      }) {
        const campaigns = await this.getCampaigns({
          params: {
            [constants.QUERY_PROP.NAME]: query,
            page: page + 1,
          },
        });
        return campaigns.map(({
          campaignId, name,
        }) => ({
          label: name,
          value: campaignId,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact ID",
      async options({
        query, page,
      }) {
        const contacts = await this.getContacts({
          params: {
            [constants.QUERY_PROP.NAME]: query,
            page: page + 1,
          },
        });
        return contacts.map(({
          contactId, name,
        }) => ({
          label: name,
          value: contactId,
        }));
      },
    },
    fromFieldId: {
      type: "string",
      label: "From Field ID",
      description: "The **From** address ID",
      async options({ page }) {
        const fromFields = await this.getFromFields({
          params: {
            page: page + 1,
          },
        });
        return fromFields.map(({
          fromFieldId, email,
        }) => ({
          label: email,
          value: fromFieldId,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "X-Auth-Token": `api-key ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, headers, path, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      try {
        return await axios(step, config);
      } catch (error) {
        console.log("Request error", error);
        throw error.response?.data?.message || error;
      }
    },
    getCampaigns(args = {}) {
      return this.makeRequest({
        path: "/campaigns",
        ...args,
      });
    },
    getCampaign({
      campaignId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/campaigns/${campaignId}`,
        ...args,
      });
    },
    getFromFields(args = {}) {
      return this.makeRequest({
        path: "/from-fields",
        ...args,
      });
    },
    getContact({
      contactId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    getContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    createContact(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/contacts",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    createNewsletter(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/newsletters",
        ...args,
      });
    },
    getNewsletters(args = {}) {
      return this.makeRequest({
        path: "/newsletters",
        ...args,
      });
    },
    getForms(args = {}) {
      return this.makeRequest({
        path: "/forms",
        ...args,
      });
    },
    getLandingPages(args = {}) {
      return this.makeRequest({
        path: "/landing-pages",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.MAX_RESOURCES,
    }) {
      let page = 1;
      let resourcesCount = 0;
      let nextResources;
      let response;
      let totalPages = 1;

      while (true) {
        try {
          response =
            await resourceFn({
              ...resourceFnArgs,
              params: {
                ...resourceFnArgs.params,
                page,
              },
              responseType: "stream",
            });
          totalPages = parseInt(response.headers.totalpages);
        } catch (error) {
          console.log("resourceFn error", error);
          return;
        }

        try {
          nextResources = await utils.getDataFromStream(response);
        } catch (error) {
          console.log("getDataFromStream error", error);
          return;
        }

        if (nextResources?.length < 1) {
          return;
        }

        page += 1;

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (page > totalPages || resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
