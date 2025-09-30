import { ConfigurationError } from "@pipedream/platform";
import app from "../../nudgify.app.mjs";

export default {
  key: "nudgify-create-purchase-nudge",
  name: "Create Purchase Nudge",
  description: "Creates a purchase nudge. [See docs here](https://www.nudgify.com/docs/knowledge-base/api-purchase-nudges/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderId: {
      type: "integer",
      label: "Order ID",
      description: "The order-id used to identify which items are part of the same order",
    },
    items: {
      type: "string[]",
      label: "Items",
      description: "One or more items as part of the purchase. Each item should be a JSON string and can contain the parameters `item_id`, `item_variation_id`, `item_name`, `item_link` and `image_url`. [See the documentation](https://www.nudgify.com/docs/knowledge-base/api-purchase-nudges/#parameters) for more information.",
      optional: true,
    },
    date: {
      propDefinition: [
        app,
        "date",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    ip: {
      propDefinition: [
        app,
        "ip",
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
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const {
      date, orderId, items, email, firstName, lastName, ip, city, state, country,
    } = this;
    const data = {
      orders: [
        {
          order_id: orderId,
          date,
          email,
          first_name: firstName,
          last_name: lastName,
          ip,
          city,
          state,
          country,
        },
      ],
    };

    try {
      if (items) {
        data.orders[0].line_items = items.map((s) => JSON.parse(s));
      }
    } catch (err) {
      throw new ConfigurationError("Error parsing items as JSON. Check that each entry in the array is a valid JSON string.");
    }

    const response = await this.app.createPurchaseNudge({
      $,
      data,
    });
    $.export("$summary", "Successfully created purchase nudge");
    return response;
  },
};
