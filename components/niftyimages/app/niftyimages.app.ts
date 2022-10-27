import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddRecordParams,
  DataStoreField,
  HttpRequestParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "niftyimages",
  propDefinitions: {
    fieldsToUpdate: {
      label: "Properties to /update",
      type: "string[]",
      async options() {
        const fields: DataStoreField[] = await this.getDataStoreFields();
        return fields.map((field) => {
          const label = field.name + (field.unique
            ? " (unique property)"
            : "");

          return {
            label,
            value: JSON.stringify(field),
          };
        });
      },
      reloadProps: true
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.niftyimages.com/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          "ApiKey": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async getDataStoreFields(): Promise<DataStoreField[]> {
      return this._httpRequest({
        endpoint: "/Store",
      });
    },
    async addRecord(
      args: AddRecordParams,
    ): Promise<object> {
      return this._httpRequest({
        endpoint: "/Store/AddRecord",
        method: "POST",
        ...args,
      });
    },
  },
});
