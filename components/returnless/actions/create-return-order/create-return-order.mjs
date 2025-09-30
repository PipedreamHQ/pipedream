import returnless from "../../returnless.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "returnless-create-return-order",
  name: "Create Return Order",
  description: "Create a return order. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/1fce50b07484b-creates-a-return-order-from-a-return-order-intent)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    returnless,
    formId: {
      propDefinition: [
        returnless,
        "formId",
      ],
    },
    locale: {
      propDefinition: [
        returnless,
        "locale",
        (c) => ({
          formId: c.formId,
        }),
      ],
    },
    input: {
      type: "string",
      label: "Input",
      description: "The input for the order. This could be an email address or postalcode or something else.",
    },
    orderId: {
      propDefinition: [
        returnless,
        "orderId",
      ],
    },
    customerHouseNumber: {
      type: "string",
      label: "Customer House Number",
      description: "The house number of the customer",
    },
    customerStreet: {
      type: "string",
      label: "Customer Street",
      description: "The street of the customer",
    },
    customerPostalCode: {
      type: "string",
      label: "Customer Postal Code",
      description: "The postal code of the customer",
    },
    customerCity: {
      type: "string",
      label: "Customer City",
      description: "The city of the customer",
    },
    customerCountryId: {
      propDefinition: [
        returnless,
        "countryId",
      ],
    },
    itemIds: {
      propDefinition: [
        returnless,
        "itemIds",
        (c) => ({
          orderId: c.orderId,
        }),
      ],
      reloadProps: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata key/value pairs to add to the return order",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.itemIds) {
      return props;
    }
    const { data: items } = await this.returnless.listSalesOrderItems({
      orderId: this.orderId,
    });
    for (const item of items) {
      props[`item${item.id}Quantity`] = {
        type: "integer",
        label: `Item ${item.id} Quantity`,
        description: `The quantity of item ${item.id} to return`,
      };
      props[`item${item.id}ReturnReasonId`] = {
        type: "string",
        label: `Item ${item.id} Return Reason ID`,
        description: `The return reason for item ${item.id}`,
        options: async () => {
          const { data: returnReasons } = await this.returnless.listReturnReasons();
          return returnReasons.map(({
            id, label,
          }) => ({
            value: id,
            label,
          }));
        },
      };
    }
    return props;
  },
  async run({ $ }) {
    const { data: order } = await this.returnless.getOrder({
      $,
      orderId: this.orderId,
    });

    const { data: intent } = await this.returnless.createReturnOrderIntent({
      $,
      data: {
        form_id: this.formId,
        locale: this.locale,
        input: this.input,
        order_number: order.order_number,
      },
    });
    if (intent.status === "failed") {
      throw new ConfigurationError(intent.status_message);
    }

    const { data: returnOrder } = await this.returnless.createReturnOrder({
      $,
      data: {
        return_order_intent_id: intent.id,
        customer: {
          house_number: this.customerHouseNumber,
          street: this.customerStreet,
          postcode: this.customerPostalCode,
          city: this.customerCity,
          country_id: this.customerCountryId,
        },
        items: this.itemIds.map((itemId) => ({
          id: itemId,
          quantity: this[`item${itemId}Quantity`],
          return_reason_id: this[`item${itemId}ReturnReasonId`],
        })),
        metadata: parseObject(this.metadata),
      },
    });

    $.export("$summary", `Return order created: ${returnOrder.id}`);
    return returnOrder;
  },
};
