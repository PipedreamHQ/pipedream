import vivocalendar from "../../vivocalendar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vivocalendar-new-customer",
  name: "New Customer Created",
  description: "Emits an event when a new customer is created within the system. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vivocalendar,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    customerName: {
      propDefinition: [
        vivocalendar,
        "customerName",
      ],
    },
    customerContact: {
      propDefinition: [
        vivocalendar,
        "customerContact",
      ],
    },
    customerEmail: {
      propDefinition: [
        vivocalendar,
        "customerEmail",
      ],
    },
    customerPhoneNumber: {
      propDefinition: [
        vivocalendar,
        "customerPhoneNumber",
        (c) => ({
          optional: true,
        }), // Making it optional
      ],
    },
    customerAddress: {
      propDefinition: [
        vivocalendar,
        "customerAddress",
        (c) => ({
          optional: true,
        }), // Making it optional
      ],
    },
  },
  hooks: {
    async deploy() {
      const customers = await this.vivocalendar.getCustomers({
        max: 50,
        sort: "created_at",
        direction: "desc",
      });
      customers.forEach((customer) => {
        this.$emit(customer, {
          id: customer.id,
          summary: `New customer: ${customer.name}`,
          ts: Date.parse(customer.created_at),
        });
      });
    },
    async activate() {
      // Code to create a webhook subscription, if applicable
    },
    async deactivate() {
      // Code to delete a webhook subscription, if applicable
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      throw new Error("No data received");
    }

    // Assuming the webhook body will contain the customer details
    const customer = {
      name: body.name,
      contact: body.contact,
      email: body.email,
      phone_number: body.phone_number,
      address: body.address,
    };

    // Emitting the new customer event
    this.$emit(customer, {
      id: body.id || `${Date.now()}`, // Using current timestamp as a fallback ID
      summary: `New customer: ${customer.name}`,
      ts: body.created_at
        ? Date.parse(body.created_at)
        : Date.now(),
    });

    this.http.respond({
      status: 200,
      body: {
        message: "Webhook received",
      },
    });
  },
};
