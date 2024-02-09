import shopify from "../shopify_partner.app.mjs";
import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import getAppName from "./queries/getAppName.mjs";

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
  dedupe: "unique",
  async additionalProps() {
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

    const appName = response?.app?.name;
    if (!appName) throw new ConfigurationError("**Invalid App ID.** Please double check the app ID and ensure that it is correct, and visible within your organization.");

    return {
      appAlert: {
        type: "alert",
        alertType: "info",
        content: `Shopify App: **${appName}**`,
      },
    };
  },
};
