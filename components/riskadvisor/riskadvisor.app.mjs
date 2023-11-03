import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "riskadvisor",
  propDefinitions: {
    clientId: {
      type: "integer",
      label: "Client",
      description: "Identifier of the client to update",
      async options({ prevContext }) {
        const params = {
          limit: constants.DEFAULT_LIMIT,
        };
        if (prevContext?.startingAfter) {
          params.starting_after = prevContext.startingAfter;
        }
        const { data } = await this.listClients({
          params,
        });
        const options = data?.map(({
          id: value, first_name, last_name,
        }) => ({
          value,
          label: `${first_name} ${last_name}`,
        })) || [];
        return {
          options,
          context: {
            startingAfter: data?.length
              ? data[data.length - 1].id
              : null,
          },
        };
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the client.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the client.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number for the client.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the client.",
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "The middle name of the client.",
      optional: true,
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "The suffix of the client.",
      optional: true,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "The date of birth of the client.",
      optional: true,
    },
    contactPreference: {
      type: "string",
      label: "Contact Preference",
      description: "The client's preferred contact method (i.e. phone or email).",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The client's gender.",
      optional: true,
    },
    education: {
      type: "string",
      label: "Education",
      description: "The client's education level.",
      optional: true,
    },
    occupation: {
      type: "string",
      label: "Occupation",
      description: "The client's occupation.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.riskadvisor.insure/api";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listClients(args = {}) {
      return this._makeRequest({
        path: "/clients",
        ...args,
      });
    },
    createClient(args = {}) {
      return this._makeRequest({
        path: "/clients",
        method: "POST",
        ...args,
      });
    },
    createRiskProfile(args = {}) {
      return this._makeRequest({
        path: "/risk-profiles",
        method: "POST",
        ...args,
      });
    },
    updateClient({
      clientId, ...args
    }) {
      return this._makeRequest({
        path: `/clients/${clientId}`,
        method: "PUT",
        ...args,
      });
    },
    async *paginate({
      resourceFn,
      args = {},
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          limit: constants.DEFAULT_LIMIT,
        },
      };
      let total = 0;
      do {
        const { data } = await resourceFn(args);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
        }
        total = data.length;
        args.params.starting_after = data[total - 1].id;
      } while (total === args.params.limit);
    },
  },
};
