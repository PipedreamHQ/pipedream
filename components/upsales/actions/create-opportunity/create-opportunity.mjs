import app from "../../upsales.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "upsales-create-opportunity",
  name: "Create Opportunity",
  description: "Creates a new opportunity in Upsales. [See the documentation](https://api.upsales.com/#4dc98812-812d-4c4c-8594-3348e05e9742)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    description: {
      type: "string",
      label: "Description",
      description: "Opportunity description",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Opportunity date (ISO 8601 format, e.g., 2024-01-15T10:00:00Z)",
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "User who created the opportunity",
    },
    clientId: {
      propDefinition: [
        app,
        "companyId",
      ],
      label: "Client ID",
      description: "Company this opportunity belongs to",
    },
    stageId: {
      propDefinition: [
        app,
        "stageId",
      ],
      description: "Stage to which the opportunity belongs to",
    },
    probability: {
      type: "integer",
      label: "Probability",
      description: "Probability percentage, between 0-99",
      min: 0,
      max: 99,
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
        orderRow,
      },
    });

    $.export("$summary", `Successfully created opportunity: ${this.description}`);
    return response;
  },
};
