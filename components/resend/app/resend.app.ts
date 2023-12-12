import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams, RetrieveEmailParams, SendEmailParams, SendEmailResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "resend",
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: "https://api.resend.com",
        headers: this._getHeaders(),
        ...args,
      });
    },
    async sendEmail(args: SendEmailParams): Promise<SendEmailResponse> {
      return this._httpRequest({
        method: "POST",
        url: "/emails",
        ...args,
      });
    },
    async retrieveEmail({
      emailId, ...args
    }: RetrieveEmailParams): Promise<object> {
      return this._httpRequest({
        url: `/emails/${emailId}`,
        ...args,
      });
    },
  },
});
