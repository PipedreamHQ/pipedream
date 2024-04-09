import shopify from "../shopify_partner.app.mjs";
import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import getAppName from "./queries/getAppName.mjs";

const errorMessage = "**Invalid App ID.** Please double check the app ID and ensure that it is correct, and visible within your organization.";

export default {
  props: {
    shopify,
    db: "$.service.db",
    timer: {
      description: "API Polling Frequency",
      type: "$.interface.timer",
      label: "timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async checkAppId() {
      const {
        appId, db,
      } = this;

      if (!appId) return {};

      const response = await new Promise((resolve) => {
        this.shopify.query({
          db,
          query: getAppName,
          variables: {
            appId: `gid://partners/App/${appId}`,
          },
          key: "shopify_partner-appname",
          handleEmit: (data) => resolve(data),
          getCursor: () => false,
        });
      });

      return response?.app?.name;
    },
  },
  dedupe: "unique",
  async additionalProps() {
    const appName = await this.checkAppId();
    return {
      appAlert: {
        type: "alert",
        alertType: appName
          ? "info"
          : "error",
        content: appName
          ? `Shopify App: **${appName}**`
          : errorMessage,
      },
    };
  },
  hooks: {
    async deploy() {
      const appName = await this.checkAppId();
      if (!appName) throw new ConfigurationError(errorMessage);
    },
  },
};
