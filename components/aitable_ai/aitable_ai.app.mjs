import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "aitable_ai",
  propDefinitions: {
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "ID of the Space",
      async options() {
        const response = await this.getSpaces({});
        const spaceIds = response.data.spaces;
        return spaceIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    fieldId: {
      type: "string",
      label: "Field ID",
      description: "ID of the Field",
      async options() {
        const response = await this.getFields({});
        const fieldIds = response.data.fields;
        return fieldIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the Datasheet",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the Datasheet",
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The Folder ID is located in the `URL` when the folder is selected on the `Workbench page`, i.e.: if the URL is `https://aitable.ai/workbench/123456`, the `Folder ID` is 123456",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the Field",
      options: constants.FIELD_TYPES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://aitable.ai/fusion/v1";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createDatasheet({
      spaceId, ...args
    }) {
      return this._makeRequest({
        path: `/spaces/${spaceId}/datasheets`,
        method: "post",
        ...args,
      });
    },
    async createField({
      spaceId, ...args
    }) {
      return this._makeRequest({
        path: `/spaces/${spaceId}/datasheets/${this.$auth.datasheet_id}/fields`,
        method: "post",
        ...args,
      });
    },
    async deleteField({
      spaceId, fieldId, ...args
    }) {
      return this._makeRequest({
        path: `/spaces/${spaceId}/datasheets/${this.$auth.datasheet_id}/fields/${fieldId}`,
        method: "delete",
        ...args,
      });
    },
    async getSpaces(args = {}) {
      return this._makeRequest({
        path: "/spaces",
        ...args,
      });
    },
    async getFields(args = {}) {
      return this._makeRequest({
        path: `/datasheets/${this.$auth.datasheet_id}/fields`,
        ...args,
      });
    },
  },
};
