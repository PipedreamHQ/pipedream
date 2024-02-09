import shopify from "../shopify_partner.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
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

    console.log("appId: ", appId);

    const { app: { name } } = await new Promise((resolve) => {
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

    return {
      appAlert: {
        type: "alert",
        alertType: "info",
        content: `App name: ${name}`,
      },
    };
  },
};
