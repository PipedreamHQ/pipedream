import common from "../common.mjs";
import getAppInstalls from "../queries/getAppInstalls.mjs";

export default {
  key: "shopify_partner-new-app-installs",
  name: "New App Installs",
  type: "source",
  version: "0.0.1",
  description: "Emit new events when new shops install your app.",
  ...common,
  props: {
    ...common.props,
    db: "$.service.db",
    appId: {
      type: "string",
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
      label: "occurredAtMix",
      optional: true,
    },
  },
  async run() {
    console.log("Retrieving shop installs");
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
      key: this.key,
      query: getAppInstalls,
      variables,
      handleEmit: (data) => {
        data.app.events.edges.map(({ node: { ...event } }) => {
          this.$emit(event, {
            id: event.occurredAt,
            summary: `Shopify shop ${event.shop.name} (${event.shop.myshopifyDomain}) installed ${event.app.name}`,
          });
        });
      },
      cursorPath: "app.events[0].edges[0].cursor",
      hasNextPagePath: "app.events.pageInfo.hasNextPage",
    });
  },
};
