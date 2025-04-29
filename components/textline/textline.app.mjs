import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "textline",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact. Eg. `(222) 222-2222`.",
      useQuery: true,
      async options({
        page,
        query,
        mapper = ({
          name: label, phone_number: value,
        }) => ({
          label,
          value,
        }),
      }) {
        const { customers } = await this.listCustomers({
          params: {
            page,
            page_size: constants.DEFAULT_LIMIT,
            query: query || "",
          },
        });
        return customers.map(mapper);
      },
    },
    groupUuid: {
      type: "string",
      label: "Group UUID",
      description: "The UUID of the group or organization.",
      async options({
        params = {
          include_groups: true,
          include_users: false,
        },
      }) {
        const { groups } = await this.listOrganizationDetails({
          params,
        });
        return groups.map(({
          name: label, uuid: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}.json`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "x-tgp-access-token": this.$auth.access_token,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      try {
        return await axios($, {
          ...args,
          url: this.getUrl(path),
          headers: this.getHeaders(headers),
        });
      } catch (error) {
        if (error.response?.status === 500) {
          console.log("Error response", error.response);
          throw new Error("Textline is currently experiencing issues. Please try again later.");
        }
        throw error;
      }
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    getCustomerByPhoneNumber(args = {}) {
      return this._makeRequest({
        path: "/customers",
        ...args,
      });
    },
    listOrganizationDetails(args = {}) {
      return this._makeRequest({
        path: "/organization",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "/customers",
        ...args,
      });
    },
  },
};
