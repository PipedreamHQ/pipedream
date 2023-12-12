import { axios } from "@pipedream/platform";
import {
  getProjectsQuery,
  getEmailSubscriptionsQuery,
} from "./common/queries.mjs";

export default {
  type: "app",
  app: "noticeable",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "An ID identifying the project",
      async options({ prevContext }) {
        const after = prevContext?.after;
        const resp = await this.sendQuery({
          query: getProjectsQuery({
            after,
            pageSize: 25,
          }),
        });
        return {
          options: resp?.data?.organization?.data?.edges?.map((item) => ({
            label: item?.node?.name,
            value: item?.node?.id,
          })),
          context: {
            after: resp?.data?.organization?.data?.pageInfo?.endCursor,
          },
        };
      },
    },
    emailSubscriptionId: {
      type: "string",
      label: "Email Subscription ID",
      description: "An ID identifying the email subscription",
      async options({
        prevContext,
        projectId,
      }) {
        const after = prevContext?.after;
        const resp = await this.sendQuery({
          query: getEmailSubscriptionsQuery({
            projectId,
            after,
            pageSize: 25,
            shortened: true,
          }),
        });
        return {
          options: resp?.data?.project?.data?.edges?.map((item) => item?.node?.email),
          context: {
            after: resp?.data?.project?.data?.pageInfo?.endCursor,
          },
        };
      },
    },
    fullName: {
      type: "string",
      label: "Fullname",
      description: "Fullname",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Subscription status",
      options: [
        "HARD_BOUNCED",
        "NON_SUBSCRIBED",
        "SPAM_COMPLAINT",
        "SUBSCRIBED",
        "SUPPRESSED",
        "UNSUBSCRIBED",
      ],
    },
  },
  methods: {
    _getUrl() {
      return "https://api.noticeable.io/graphql";
    },
    _getHeaders() {
      return {
        "Authorization": `Apikey ${this.$auth.api_key}`,
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    async _makeRequest({
      $,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(),
        headers: this._getHeaders(),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async sendQuery({
      query,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        data: {
          query,
        },
        ...args,
      });
    },
  },
};
