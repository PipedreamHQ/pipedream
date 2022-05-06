import common from "../common.mjs";
import shopify from "../shopify_partner.app.mjs";
import getAppRelationshipEvents from "../queries/getAppRelationshipEvents.mjs";

export default {
  key: "shopify_partner-new-app-relationship-events",
  name: "New App Relationship Events",
  type: "source",
  version: "0.0.3",
  description: "Emit new events when new shops installs, uninstalls, subscribes or unsubscribes your app.",
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
    paginationEnabled: {
      propDefinition: [
        shopify,
        "paginationEnabled",
      ],
    },
  },
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

    console.log("Querying events");

    await this.shopify.query({
      db,
      key: "shopify_partner-relationship-events",
      query: getAppRelationshipEvents,
      variables,
      handleEmit: (data) => {
        data.app.events.edges.map(({ node: { ...event } }) => {
          this.$emit(event, {
            id: event.occurredAt,
            summary: `${event.shop.name} (${event.shop.myshopifyDomain}) installed ${event.app.name}`,
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
