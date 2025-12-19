import { ConfigurationError } from "@pipedream/platform";
import app from "../../upsales.app.mjs";
import orderProps from "../../common/orderProps.mjs";

export default {
  key: "upsales-create-order",
  name: "Create Order",
  description: "Creates a new order in Upsales. [See the documentation](https://api.upsales.com/#9c402e62-1951-4b50-9372-6f2664736431)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    ...orderProps,
  },
  async run({ $ }) {
    const custom = this.custom?.map((item) => {
      try {
        return typeof item === "string"
          ? JSON.parse(item)
          : item;
      } catch (e) {
        throw new ConfigurationError(`Invalid JSON in custom field: ${item}`);
      }
    });

    const orderRow = this.orderRow?.map((item) => {
      try {
        return typeof item === "string"
          ? JSON.parse(item)
          : item;
      } catch (e) {
        throw new ConfigurationError(`Invalid JSON in orderRow field: ${item}`);
      }
    });

    let projects = this.projects;
    if (projects && typeof projects === "string") {
      try {
        projects = JSON.parse(projects);
      } catch (e) {
        throw new ConfigurationError(`Invalid JSON in projects field: ${projects}`);
      }
    }

    const response = await this.app.createOrder({
      $,
      data: {
        description: this.description,
        date: this.date,
        user: {
          id: this.userId,
        },
        client: {
          id: this.clientId,
        },
        stage: {
          id: this.stageId,
        },
        probability: this.probability,
        closeDate: this.closeDate,
        notes: this.notes,
        contact: this.contactId
          ? {
            id: this.contactId,
          }
          : undefined,
        projects,
        clientConnection: this.clientConnectionId
          ? {
            id: this.clientConnectionId,
          }
          : undefined,
        currencyRate: this.currencyRate,
        currency: this.currency,
        custom,
        competitorId: this.competitorId,
        lostReason: this.lostReason,
        notify: this.notify,
        orderRow,
      },
    });

    $.export("$summary", `Successfully created order: ${this.description}`);
    return response;
  },
};

