import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cisco_meraki",
  propDefinitions: {
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options() {
        const organizations = await this.listOrganizations();
        return organizations.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    networkId: {
      type: "string",
      label: "Network ID",
      description: "The ID of the network",
      async options({ orgId }) {
        const networks = await this.listOrganizationNetworks({
          orgId,
        });
        return networks.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
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
        "X-Cisco-Meraki-API-Key": this.$auth.api_key,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this.makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    listOrganizationNetworks({
      orgId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/organizations/${orgId}/networks`,
        ...args,
      });
    },
  },
};
