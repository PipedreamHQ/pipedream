import { ConfigurationError } from "@pipedream/platform";
import app from "../../upsales.app.mjs";
import orderProps from "../../common/orderProps.mjs";
import { makePropsOptional } from "../../common/utils.mjs";

export default {
  key: "upsales-update-order",
  name: "Update Order",
  description: "Updates an existing order in Upsales. [See the documentation](https://api.upsales.com/#eec6ead8-d121-40e6-9910-185ca06ac323)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    ...makePropsOptional(orderProps),
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

    const response = await this.app.updateOrder({
      $,
      orderId: this.orderId,
      data: {
        description: this.description,
        date: this.date,
        user: this.userId
          ? {
            id: this.userId,
          }
          : undefined,
        client: this.clientId
          ? {
            id: this.clientId,
          }
          : undefined,
        stage: this.stageId
          ? {
            id: this.stageId,
          }
          : undefined,
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

    $.export("$summary", `Successfully updated order: ${this.description || this.orderId}`);
    return response;
  },
};

