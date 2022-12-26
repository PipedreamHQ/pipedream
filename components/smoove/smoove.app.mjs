import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "smoove",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Contact id of the subscriber",
      async options({
        page,
        mapper = ({
          email, firstName, lastName, id: value,
        }) => ({
          label: `${firstName} ${lastName} (${email})`.trim(),
          value,
        }),
      }) {
        const contacts = await this.getContacts({
          params: {
            page: page + 1,
            itemsPerPage: constants.DEFAULT_LIMIT,
            sort: "-id",
          },
        });
        return contacts.map(mapper);
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the subscriber.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the subscriber.",
      optional: true,
    },
    cellPhone: {
      type: "string",
      label: "Cellphone",
      description: "Cellphone of the subscriber.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the subscriber.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the subscriber.",
      optional: true,
    },
    position: {
      type: "string",
      label: "Position",
      description: "Position of the subscriber.",
      optional: true,
    },
    canReceiveEmails: {
      type: "boolean",
      label: "Can Receive Emails",
      description: "Can receive emails flag",
      optional: true,
    },
    canReceiveSmsMessages: {
      type: "boolean",
      label: "Can Receive SMS Messages",
      description: "Can receive sms messages flag.",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };

      return axios(step, config);
    },
    getContacts(args = {}) {
      return this.makeRequest({
        path: "/Contacts",
        ...args,
      });
    },
    getContact({
      contactId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/Contacts/${contactId}`,
        ...args,
      });
    },
    createUpdateContact(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/Contacts",
        ...args,
      });
    },
    getLandingPages(args = {}) {
      return this.makeRequest({
        path: "/LandingPages",
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

      while (true) {
        try {
          nextResources = await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              page,
            },
          });
        } catch (error) {
          if (error.response.status === 404) {
            console.log("No more resources");
            return;
          }
          throw error;
        }

        if (!nextResources?.length) {
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;
        }

        page += 1;

        if (resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
