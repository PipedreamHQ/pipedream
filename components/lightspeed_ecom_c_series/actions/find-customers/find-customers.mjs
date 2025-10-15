import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  key: "lightspeed_ecom_c_series-find-customers",
  name: "Find Customers",
  description: "Find a customer by ID. [See the documentation](https://developers.lightspeedhq.com/ecom/endpoints/customer/#get-all-customers)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    customerEmail: {
      propDefinition: [
        app,
        "customerEmail",
      ],
      description: "Retrieve all customers from a specific customer based on the customer email",
      optional: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Restrict results to after the specified ID",
      optional: true,
    },
    createdAtMin: {
      propDefinition: [
        app,
        "createdAtMin",
      ],
      description: "Show customers created after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    createdAtMax: {
      propDefinition: [
        app,
        "createdAtMax",
      ],
      description: "Show customers created before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    updatedAtMin: {
      propDefinition: [
        app,
        "updatedAtMin",
      ],
      description: "Show customers last updated after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    updatedAtMax: {
      propDefinition: [
        app,
        "updatedAtMax",
      ],
      description: "Show customers last updated before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
  },
  async run({ $ }) {
    const response = this.app.paginate({
      fn: this.app.listCustomers,
      $,
      params: {
        email: this.customerEmail,
        since_id: this.sinceId,
        created_at_min: this.createdAtMin,
        created_at_max: this.createdAtMax,
        updated_at_min: this.updatedAtMin,
        updated_at_max: this.updatedAtMax,
      },
      dataField: "customers",
    });

    const customers = [];
    for await (const customer of response) {
      customers.push(customer);
    }

    $.export("$summary", `Successfully found ${customers.length} customer${customers.length === 1
      ? ""
      : "s"}`);
    return customers;
  },
};
