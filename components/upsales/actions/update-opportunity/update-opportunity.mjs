import app from "../../upsales.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "upsales-update-opportunity",
  name: "Update Opportunity",
  description: "Updates an existing opportunity in Upsales. [See the documentation](https://api.upsales.com/#c0ea716a-24ce-4e57-82ac-4bb75b303277)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Opportunity description",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Opportunity date (ISO 8601 format, e.g., 2024-01-15T10:00:00Z)",
      optional: true,
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "User who created the opportunity",
      optional: true,
    },
    clientId: {
      propDefinition: [
        app,
        "companyId",
      ],
      label: "Client ID",
      description: "Company this opportunity belongs to",
      optional: true,
    },
    stageId: {
      propDefinition: [
        app,
        "stageId",
      ],
      description: "Stage to which the opportunity belongs to",
      optional: true,
    },
    orderRow: {
      type: "string[]",
      label: "Order Rows",
      description: "Array of order row objects in JSON format. Each entry should be a string like `{ \"product\": { \"id\": 123 }, \"quantity\": 2, \"price\": 100 }`. [See the documentation](https://api.upsales.com/#b62d7eee-7483-47e2-821e-70834a5b5c17) for all available properties.",
      optional: true,
    },
  },
  async run({ $ }) {
    const orderRow = this.orderRow?.map((item) => {
      try {
        return typeof item === "string"
          ? JSON.parse(item)
          : item;
      } catch (e) {
        throw new ConfigurationError(`Invalid JSON in orderRow field: ${item}`);
      }
    });

    const response = await this.app.updateOrder({
      $,
      orderId: this.opportunityId,
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
        orderRow,
      },
    });

    $.export("$summary", `Successfully updated opportunity: ${this.description}`);
    return response;
  },
};
