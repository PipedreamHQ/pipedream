import common from "../../common/common.mjs";
import shopify from "../../shopify_partner.app.mjs";
import getAppUninstalls from "../../common/queries/getAppUninstalls.mjs";

export default {
  key: "shopify_partner-new-app-uninstalls",
  name: "New App Uninstalls",
  type: "source",
  version: "0.1.4",
  description: "Emit new events when new shops uninstall your app.",
  ...common,
  props: {
    ...common.props,
    appId: {
      propDefinition: [
        shopify,
        "appId",
      ],
    },
    occurredAtMin: {
      propDefinition: [
        shopify,
        "occurredAtMin",
      ],
    },
    occurredAtMax: {
      propDefinition: [
        shopify,
        "occurredAtMax",
      ],
    },
  },
  async run() {
    const {
      appId, occurredAtMin, occurredAtMax, db,
    } = this;

    const variables = {
      appId: `gid://partners/App/${appId}`,
    };
    if (occurredAtMin) {
      variables.occurredAtMin = occurredAtMin.trim();
    }
    if (occurredAtMax) {
      variables.occurredAtMax = occurredAtMax.trim();
    }

    await this.shopify.query({
      db,
      query: getAppUninstalls,
      variables,
      key: "shopify_partner-uninstalls",
      handleEmit: (data) => {
        data.app.events.edges.map(({ node: { ...event } }) => {
          this.$emit(event, {
            id: event.occurredAt,
            summary: `${event.shop.name} (${event.shop.myshopifyDomain}) uninstalled ${event.app.name}`,
          });
        });
      },
      getCursor: (data) => {
        const edges = data?.transactions?.edges || [];
        const [
          last,
        ] = edges.reverse();
        return last?.cursor;
      },
      hasNextPagePath: "app.events.pageInfo.hasNextPage",
    });
  },
};
