const shopify = require("../shopify_partner.app.js");
const getAppInstalls = require("../queries/getAppInstalls");

module.exports = {
  key: "new-app-installs",
  name: "New App Installs",
  type: "source",
  version: "0.0.1",
  description: "Emit new events when new shops install your app.",
  props: {
    shopify,
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
    const { appId, occurredAtMin, occurredAtMax } = this;

    const variables = {
      appId,
      ...(occurredAtMin || {}),
      ...(occurredAtMax || {}),
    };

    const data = await this.shopify.query({
      query: getAppInstalls,
      variables,
    });

    console.log("response", data);

    data.app.events.edges.map(({ node: { ...event } }) => {
      this.$emit(event, { id: event.occurredAt });
    });
  },
};
