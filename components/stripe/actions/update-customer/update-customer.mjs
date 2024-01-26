import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-update-customer",
  name: "Update a Customer",
  type: "action",
  version: "0.1.0",
  description: "Update a customer. [See the docs](https://stripe.com/docs/api/customers/update) " +
    "for more information",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
      optional: false,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    line1: {
      propDefinition: [
        app,
        "address1",
      ],
    },
    line2: {
      propDefinition: [
        app,
        "address2",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    postal_code: {
      propDefinition: [
        app,
        "postal_code",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
    advanced: {
      propDefinition: [
        app,
        "metadata",
      ],
      label: "Advanced Options",
      description: "Specify less-common options that you require. See [Create a Customer]" +
        "(https://stripe.com/docs/api/customers/create) for a list of supported options.",
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "name",
      "email",
      "phone",
      "description",
      "metadata",
    ]);
    const address = pick(this, [
      "line1",
      "line2",
      "city",
      "state",
      "postal_code",
      "country",
    ]);
    const resp = await this.app.sdk().customers.update(this.customer, {
      ...params,
      address,
      ...this.advanced,
    });
    $.export("$summary", `Successfully updated the customer, "${resp.id}"`);
    return resp;
  },
};
