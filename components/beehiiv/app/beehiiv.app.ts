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
      description: "Whether or not to reactivate the subscriber if they have already unsubscribed.  **This option should be used only if the subscriber is knowingly resubscribing**. default: `false`.",
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
    _getUrl(path, params = {}) {
      let formattedPath = path;
      for (const [
        key,
        value,
      ] of Object.entries(params)) {
        formattedPath = formattedPath.replace(`{${key}}`, value);
      }
      return `https://api.beehiiv.com/v2${formattedPath}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _getRequestParams(opts: Record<string, unknown>) {
      return {
        ...opts,
        url: this._getUrl(opts.path, opts.params),
        headers: this._getHeaders(),
      };
    },
    async createSubscriber($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/publications/{publicationId}/subscriptions",
        params: {
          publicationId: param.publication_id,
        },
        data: param,
      }));
      return response;
    },
    async listPublications($ = this) {
      const response = await axios($, this._getRequestParams({
        method: "GET",
        path: "/publications",
      }));
      return {
        publications: response.data,
      };
    },
    async getPublicationOpts() {
      const { publications } = await this.listPublications(this);
      return publications.map((publication) => ({
        label: publication.name,
        value: publication.id,
      }));
    },
    async _makeRequest({
      $ = this, path, method = "GET", params = {}, data = undefined,
      pathParams = {},
    }: Record<string, unknown>) {
      return axios($, {
        method,
        url: this._getUrl(path, pathParams),
        headers: this._getHeaders(),
        params,
        data,
      });
    },
    async getSubscription(
      $ = this, publicationId: string, subscriptionId: string,
      params: Record<string, unknown> = {},
    ) {
      return this._makeRequest({
        $,
        path: "/publications/{publicationId}/subscriptions/{subscriptionId}",
        pathParams: {
          publicationId,
          subscriptionId,
        },
        params,
      });
    },
    async getSubscriptionByEmail(
      $ = this, publicationId: string, email: string, params: Record<string, unknown> = {},
    ) {
      return this._makeRequest({
        $,
        path: "/publications/{publicationId}/subscriptions/by_email/{email}",
        pathParams: {
          publicationId,
          email: encodeURIComponent(email),
        },
        params,
      });
    },
    async listSubscriptions(
      $ = this, publicationId: string, params: Record<string, unknown> = {},
    ) {
      return this._makeRequest({
        $,
        path: "/publications/{publicationId}/subscriptions",
        pathParams: {
          publicationId,
        },
        params,
      });
    },
    async updateSubscription(
      $ = this, publicationId: string, subscriptionId: string, data: Record<string, unknown>,
    ) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: "/publications/{publicationId}/subscriptions/{subscriptionId}",
        pathParams: {
          publicationId,
          subscriptionId,
        },
        data,
      });
    },
    async listPosts($ = this, publicationId: string, params: Record<string, unknown> = {}) {
      return this._makeRequest({
        $,
        path: "/publications/{publicationId}/posts",
        pathParams: {
          publicationId,
        },
        params,
      });
    },
    async createPost($ = this, publicationId: string, data: Record<string, unknown>) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/publications/{publicationId}/posts",
        pathParams: {
          publicationId,
        },
        data,
      });
    },
    async getAggregateStats(
      $ = this, publicationId: string, params: Record<string, unknown> = {},
    ) {
      return this._makeRequest({
        $,
        path: "/publications/{publicationId}/posts/aggregate_stats",
        pathParams: {
          publicationId,
        },
        params,
      });
    },
    async listCustomFields($ = this, publicationId: string) {
      return this._makeRequest({
        $,
        path: "/publications/{publicationId}/custom_fields",
        pathParams: {
          publicationId,
        },
      });
    },
    async listSegments(
      $ = this, publicationId: string, params: Record<string, unknown> = {},
    ) {
      return this._makeRequest({
        $,
        path: "/publications/{publicationId}/segments",
        pathParams: {
          publicationId,
        },
        params,
      });
    },
  },
});
