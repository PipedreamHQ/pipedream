import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "beehiiv",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber.",
    },
    publicationId: {
      type: "string",
      label: "Publication Id",
      description: "The ID of the publication you want to subscribe to.",
      async options() {
        return this.getPublicationOpts();
      },
    },
    reactivateExisting: {
      type: "boolean",
      label: "Reactivate Existing",
      description: "Whether or not to reactivate the subscriber if they have already unsubscribed. **This option should be used only if the subscriber is knowingly resubscribing**. default: `false`.",
      optional: true,
    },
    sendWelcomeEmail: {
      type: "boolean",
      label: "Send Welcome Email",
      description: "Whether or not to send a welcome email to the subscriber. default: `false`.",
      optional: true,
    },
    utmSource: {
      type: "string",
      label: "UTM Source",
      description: "The source of the subscriber.",
      optional: true,
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.beehiiv.com/v1${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "X-ApiKey": this.$auth.api_key,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _getRequestParams(opts: any) {
      return {
        ...opts,
        url: this._getUrl(opts.path),
        headers: this._getHeaders(),
      };
    },
    async createSubscriber($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/subscribers",
        data: param,
      }));
      return response;
    },
    async listPublications($ = this) {
      const response = await axios($, this._getRequestParams({
        method: "GET",
        path: "/publications",
      }));
      return response;
    },
    async getPublicationOpts() {
      const { publications } = await this.listPublications(this);
      return publications.map((publication) => ({
        label: publication.name,
        value: publication.id,
      }));
    },
  },
});
