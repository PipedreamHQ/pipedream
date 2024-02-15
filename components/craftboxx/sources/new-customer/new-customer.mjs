import craftboxx from "../../craftboxx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "craftboxx-new-customer",
  name: "New Customer Created",
  description: "Emits an event when a new customer is created in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    craftboxx,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    customerDetails: {
      propDefinition: [
        craftboxx,
        "customerDetails",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit up to 50 historical events on deploy
      let page = 0;
      const limit = 50;
      let totalEmitted = 0;

      while (totalEmitted < limit) {
        const response = await this.craftboxx._makeRequest({
          path: "/customers",
          params: {
            page: page,
            perPage: limit,
          },
        });

        if (!response || response.length === 0) {
          break;
        }

        for (const customer of response) {
          this.$emit(customer, {
            id: customer.id,
            summary: `New Customer: ${customer.name}`,
            ts: Date.parse(customer.createdAt),
          });
          totalEmitted++;

          if (totalEmitted >= limit) {
            break;
          }
        }

        page++;
      }
    },
  },
  async run() {
    const lastProcessedTimestamp = this.db.get("lastProcessedTimestamp") || 0;
    const response = await this.craftboxx._makeRequest({
      path: "/customers",
      params: {
        since: lastProcessedTimestamp,
      },
    });

    for (const customer of response) {
      const createdAtTimestamp = Date.parse(customer.createdAt);

      if (createdAtTimestamp > lastProcessedTimestamp) {
        this.$emit(customer, {
          id: customer.id,
          summary: `New Customer: ${customer.name}`,
          ts: createdAtTimestamp,
        });
      }
    }

    // Update the last processed timestamp
    if (response.length > 0) {
      const latestTimestamp = Math.max(...response.map((customer) => Date.parse(customer.createdAt)));
      this.db.set("lastProcessedTimestamp", latestTimestamp);
    }
  },
};
