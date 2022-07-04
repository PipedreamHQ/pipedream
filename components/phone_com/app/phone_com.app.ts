import { defineApp } from "@pipedream/types";
import axios from "axios";
import { httpRequestParams, apiResponse, sendMessageParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "phone_com",
  methods: {
    _baseUrl(): string {
      return 'https://api.phone.com/v4';
    },
    async _httpRequest({ method, endpoint, data }: httpRequestParams): apiResponse {
      return axios({
        method,
        url: this._baseUrl() + endpoint,
        headers: {
          Authorization: `Bearer ${this.$auth.access_token}`,
        },
        data
      })
    },
    async listAccounts(): apiResponse {
      return this._httpRequest({
        method: "GET",
        endpoint: "/accounts"
      });
    },
    async sendMessage(data: sendMessageParams): apiResponse {
      return this._httpRequest({
        method: 'POST',
        endpoint: `accounts/${this.account}/messages`,
        data
      })
    }
  },
  propDefinitions: {
    account: {
      type: "string",
      label: 'Account (VoIP ID)',
      description: `Select an **account** from the list.
        \\
        Alternatively, you can provide a custom *VoIP ID*.`,
      async options(): Promise<object[]> {
        const response = await this.listAccounts();

        const items = response.items;
        if (!items) throw new Error(response.error);

        console.log(response);
        // mocked return value - see below
        return [{
          label: 'Option 1',
          value: "abc"
        }, {
          label: 'Option 2',
          value: "def"
        }];
        // the properties of the returned items are not documented,
        // so this needs to be tested and adjusted accordingly
        /*
        return response.items.map(item => {
          return {
            label: item.name,
            value: item.id,
          }
        });
        */
      }
    }
  }
});