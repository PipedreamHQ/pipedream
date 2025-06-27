import { defineApp } from "@pipedream/types";
import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";
import {
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
      try {
        return await axios($, {
          baseURL: this._baseUrl(),
          headers: {
            ...headers,
            Apikey: this._apiKey(),
          },
          ...args,
        });
      } catch (error) {
        throw new ConfigurationError(`${error.response.status} - ${error.response.statusText} - Please try again`);
      }
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
    convertToPDF(args = {}): Promise<Buffer> {
      return this._httpRequest({
        method: "POST",
        url: "/convert/docx/to/pdf",
        ...args,
      });
    },
  },
});
