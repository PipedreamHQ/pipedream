const shopify = require("../shopify_partner.app.js");
const getAppUninstalls = require("../queries/getAppUninstalls");

module.exports = {
  key: "shopify_partner-new-app-uninstalls",
  name: "New App Uninstalls",
  type: "source",
  version: "0.0.1",
  description: "Emit new events when new shops uninstall your app.",
  props: {
    shopify,
    db: "$.service.db",
    appId: {
      type: "string",
      optional: false,
      description: "gid://partners/App/<your App ID here>",
      label: "Shopify App ID",
    },
    occurredAtMin: {
      type: "string",
      description:
        "Only include install events after this specific time (ISO timestamp)",
      label: "occurredAtMin",
      optional: true,
    },
    occurredAtMax: {
      type: "string",
      description:
        "Only include install events up to this specific time (ISO timestamp)",
      label: "occurredAtMin",
      optional: true,
    },
    timer: {
      description: "How often this action should run",
      type: "$.interface.timer",
      label: "timer",
      default: {
        intervalSeconds: 60 * 60,
      },
    },
  },
  dedupe: "unique",
  async run() {
    const {
      appId,
      occurredAtMin,
      occurredAtMax,
      db,
    } = this;

    const variables = {
      appId,
      ...(occurredAtMin || {}),
      ...(occurredAtMax || {}),
    };

    await this.shopify.query({
      db,
      query: getAppUninstalls,
      variables,
      key: this.key,
      handleEmit: (data) => {
        data.app.events.edges.map(({ node: { ...event } }) => {
          this.$emit(event, {
            id: event.occurredAt,
            summary: `Shopify shop ${event.shop.name} (${event.shop.myshopifyDomain}) uninstalled ${event.app.name}`,
          });
        });
      },
      cursorPath: "app.events[0].edges[0].cursor",
      hasNextPagePath: "app.events.pageInfo.hasNextPage",
    });
  },
};
