import { axios } from "@pipedream/platform";
import {
  camelCaseToWords, capitalizeFirstLetter,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "twenty",
  propDefinitions: {
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to update or delete.",
      async options() {
        const { components: { schemas } } = await this.listRecords();

        return Object.entries(schemas).filter(([
          key,
        ]) => key != "Attachment")
          .map(([
            key,
          ]) => ({
            label: camelCaseToWords(key),
            value: key,
          }));
      },
    },
    actionType: {
      type: "string",
      label: "Action Type",
      description: "Specify the action to perform: create, update, or delete.",
      options: [
        {
          label: "Create",
          value: "create",
        },
        {
          label: "Update",
          value: "update",
        },
        {
          label: "Delete",
          value: "delete",
        },
      ],
      default: "create",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.twenty.com";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listRecords() {
      return this._makeRequest({
        path: "/open-api/core",
      });
    },
    listRecordItems(recordId) {
      return this._makeRequest({
        path: `/rest/${capitalizeFirstLetter(recordId)}`,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/rest/webhooks",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/rest/webhooks/${hookId}`,
      });
    },
    createRecord({
      recordName, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/rest/${recordName}`,
        ...opts,
      });
    },
    updateRecord({
      recordName, id, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/rest/${recordName}/${id}`,
        ...opts,
      });
    },
    deleteRecord({
      id, recordName,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/rest/${recordName}/${id}`,
      });
    },
    performAction({
      actionType, id, recordName, ...opts
    }) {
      switch (actionType) {
      case "create":
        return this.createRecord({
          recordName,
          ...opts,
        });
      case "update":
        return this.updateRecord({
          recordName,
          id,
          ...opts,
        });
      case "delete":
        return this.deleteRecord({
          id,
          recordName,
        });
      }
    },
  },
};
