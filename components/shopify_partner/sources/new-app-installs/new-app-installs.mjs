import common from "../../common/common.mjs";
import shopify from "../../shopify_partner.app.mjs";
import getAppInstalls from "../../common/queries/getAppInstalls.mjs";

export default {
  key: "shopify_partner-new-app-installs",
  name: "New App Installs",
  type: "source",
  version: "0.1.3",
  description: "Emit new events when new shops install your app.",
  ...common,
  props: {
    ...common.props,
    db: "$.service.db",
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
      key: "shopify_partner-installs",
      query: getAppInstalls,
      variables,
      handleEmit: (data) => {
        if (data?.app?.events) {
          data.app.events.edges.map(({ node: { ...event } }) => {
            this.$emit(event, {
              id: event.occurredAt,
              summary: `${event.shop.name} (${event.shop.myshopifyDomain}) installed ${event.app.name}`,
            });
          });
        }
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
