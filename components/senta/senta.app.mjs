import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "senta",
  propDefinitions: {
    clientViewId: {
      type: "string",
      label: "Client View ID",
      description: "Take any publicly-browsable client list, e.g. `https://acme.senta.co/c/l/v08a361263f4a` - the `v08a361263f4a` is the \"viewId\", i.e. the unique id of the client list that has been created by the practice.",
    },
    clientId: {
      type: "string",
      label: "Client",
      description: "Identifier of a client",
      async options({ clientViewId }) {
        if (!clientViewId) {
          return [];
        }
        const { docs } = await this.listClients({
          clientViewId,
        });
        return docs?.map((client) => ({
          value: client._id,
          label: client["Client name"] || client._id,
        })) || [];
      },
    },
    clientState: {
      type: "string",
      label: "State",
      description: "State of the client",
      options: constants.CLIENT_STATE,
      optional: true,
    },
    clientType: {
      type: "string",
      label: "Type",
      description: "Type of client",
      options: constants.CLIENT_TYPE,
      optional: true,
    },
    businessArea: {
      type: "string",
      label: "Business Area",
      description: "Business area of the client",
      options: constants.BUSINESS_AREA,
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Name of the client",
    },
    email: {
      type: "string",
      label: "Contact Email",
      description: "Email address of the primary contact",
      optional: true,
    },
    telephone: {
      type: "string",
      label: "Telephone",
      description: "Phone number of the client",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website URL of the client",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.senta.co/api`;
    },
    _headers() {
      return {
        "x-auth": `${this.$auth.api_key}`,
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
    getClient({
      clientId, ...args
    }) {
      return this._makeRequest({
        path: `/clients/${clientId}`,
        ...args,
      });
    },
    listClients({
      clientViewId, ...args
    }) {
      return this._makeRequest({
        path: `/clients/${clientViewId}`,
        ...args,
      });
    },
    listJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs",
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
    updateClient({
      clientId, ...args
    }) {
      return this._makeRequest({
        path: `/clients/${clientId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
