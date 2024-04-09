import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "passslot",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Identifier of the template to use",
      async options() {
        const templates = await this.listTemplates();
        return templates?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    passTypeIdentifier: {
      type: "string",
      label: "Pass Type Identifier",
      description: "The Pass Type Identifier of the pass",
      async options() {
        const passes = await this.listPasses();
        const passTypeIdentifiers = passes?.map(({ passType }) => passType) || [];
        return Array.from(new Set(passTypeIdentifiers));
      },
    },
    passSerialNumber: {
      type: "string",
      label: "Pass Serial Number",
      description: "Serial Number of the pass to select",
      async options({ passTypeIdentifier }) {
        const passes = await this.listPasses();
        if (!passes?.length) {
          return [];
        }
        return passes
          .filter(({ passType }) => passType === passTypeIdentifier)
          .map(({ serialNumber }) => serialNumber) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.passslot.com/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.app_key}`,
          password: "",
        },
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    listPasses(opts = {}) {
      return this._makeRequest({
        path: "/passes",
        ...opts,
      });
    },
    getTemplate({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
        ...opts,
      });
    },
    getPassValues({
      passTypeIdentifier, passSerialNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/passes/${passTypeIdentifier}/${passSerialNumber}/values`,
        ...opts,
      });
    },
    createPass({
      templateId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/templates/${templateId}/pass`,
        ...opts,
      });
    },
    updatePass({
      passTypeIdentifier, passSerialNumber, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/passes/${passTypeIdentifier}/${passSerialNumber}/values`,
        ...opts,
      });
    },
    deletePass({
      passTypeIdentifier, passSerialNumber, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/passes/${passTypeIdentifier}/${passSerialNumber}`,
        ...opts,
      });
    },
  },
};
