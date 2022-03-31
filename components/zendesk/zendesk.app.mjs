import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zendesk",
  propDefinitions: {
    categoryId: {
      type: "string",
      label: "Trigger category ID",
      description: "The ID of the trigger category. [See the docs here](https://developer.zendesk.com/api-reference/ticketing/business-rules/trigger_categories/#list-trigger-categories)",
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          trigger_categories: categories,
          meta,
        } =
          await this.listTriggerCategories({
            params: {
              [constants.PAGE_SIZE_PARAM]: 20,
              sort: constants.SORT_BY_POSITION_ASC,
              [constants.PAGE_AFTER_PARAM]: afterCursor,
            },
          });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: categories.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
        };
      },
    },
  },
  methods: {
    getApiUrl({
      path, subdomain,
    }) {
      const {
        SUBDOMAIN_PLACEHOLDER,
        BASE_URL,
        VERSION_PATH,
      } = constants;
      return `${BASE_URL.replace(SUBDOMAIN_PLACEHOLDER, subdomain)}${VERSION_PATH}${path}`;
    },
    async makeRequest(customConfig) {
      const {
        $,
        url,
        path,
        ...configProps
      } = customConfig;

      const {
        oauth_access_token: oauthAccessToken,
        subdomain,
      } = this.$auth;

      const headers = {
        ...configProps?.headers,
        authorization: `Bearer ${oauthAccessToken}`,
      };

      const config = {
        ...configProps,
        headers,
        url: url ?? this.getApiUrl({
          subdomain,
          path,
        }),
        timeout: 10000,
      };

      return axios($ ?? this, config);
    },
    async createTrigger({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/triggers",
        data,
      });
    },
    async deleteTrigger({
      $, triggerId,
    }) {
      return this.makeRequest({
        $,
        method: "delete",
        path: `/triggers/${triggerId}`,
      });
    },
    async listTriggerCategories({
      $, url, params,
    }) {
      return this.makeRequest({
        $,
        url,
        path: "/trigger_categories",
        params,
      });
    },
    async createWebhook({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/webhooks",
        data,
      });
    },
    async deleteWebhook({
      $, webhookId,
    }) {
      return this.makeRequest({
        $,
        method: "delete",
        path: `/webhooks/${webhookId}`,
      });
    },
    async showWebhookSigningSecret({
      $, webhookId,
    }) {
      return this.makeRequest({
        $,
        path: `/webhooks/${webhookId}/signing_secret`,
      });
    },
  },
};
