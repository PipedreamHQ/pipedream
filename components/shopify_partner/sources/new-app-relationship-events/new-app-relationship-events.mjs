import common from "../../common/common.mjs";
import shopify from "../../shopify_partner.app.mjs";
import getAppRelationshipEventsBackwards from "../../common/queries/getAppRelationshipEventsBackwards.mjs";
import getAppRelationshipEventsForwards from "../../common/queries/getAppRelationshipEventsForwards.mjs";

export default {
  key: "shopify_partner-new-app-relationship-events",
  name: "New App Relationship Events",
  type: "source",
  version: "0.1.4",
  description:
    "Emit new events when new shops installs, uninstalls, subscribes or unsubscribes your app.",
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
    recordsPerRun: {
      propDefinition: [
        shopify,
        "recordsPerRun",
      ],
    },
    paginationDirection: {
      propDefinition: [
        shopify,
        "paginationDirection",
      ],
    },
  },
  async run() {
    const {
      appId,
      occurredAtMin,
      occurredAtMax,
      db,
      paginationDirection,
      recordsPerRun,
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

    console.log("Querying events");

    await this.shopify.query({
      db,
      key: "shopify_partner-relationship-events",
      query:
        this.paginationDirection === "backward" ||
        !this.db.get("shopify_partner-relationship-events") // on the first run, pull records from present day
          ? getAppRelationshipEventsBackwards
          : getAppRelationshipEventsForwards,
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
        const edges = data?.app?.events?.edges || [];
        if (this.paginationDirection === "backward") {
          const last = edges[edges.length - 1];
          console.log("Last event in batch: ", last);
          return last?.cursor;
        } else {
          const [
            first,
          ] = edges;
          console.log("First event in batch: ", first);
          return first?.cursor;
        }
      },
      hasNextPagePath:
        this.paginationDirection === "forward" ||
        !this.db.get("shopify_partner-relationship-events")
          ? "app.events.pageInfo.hasNextPage"
          : "app.events.pageInfo.hasPreviousPage",
      paginationDirection,
      recordsPerRun,
    });
  },
};
