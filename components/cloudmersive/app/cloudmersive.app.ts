import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import FormData from "form-data";
import {
  ConvertToPDFParams,
  HttpRequestParams, ScreenshotWebsiteParams, ValidateEmailAddressParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "cloudmersive",
  methods: {
    _apiKey(): string {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.cloudmersive.com";
    },
    async _httpRequest({
      $ = this,
      headers,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Apikey: this._apiKey(),
        },
        ...args,
      });
    },
    async validateEmailAddress({
      email, ...args
    }: ValidateEmailAddressParams): Promise<object> {
      return this._httpRequest({
        method: "POST",
        url: "/validate/email/address/full",
        data: email,
        ...args,
      });
    },
    async screenshotWebsite(args: ScreenshotWebsiteParams): Promise<Buffer> {
      return this._httpRequest({
        method: "POST",
        url: "/convert/web/url/to/screenshot",
        ...args,
      });
    },
    async convertToPDF({
      file, ...args
    }: ConvertToPDFParams): Promise<Buffer> {
      const data = new FormData();
      data.append("InputFile", file);
      return this._httpRequest({
        method: "POST",
        url: "/convert/docx/to/pdf",
        headers: data.getHeaders(),
        data,
        ...args,
      });
    },
  },
});
