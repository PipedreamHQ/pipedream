import { ConfigurationError } from "@pipedream/platform";
import {
  LOCK_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import plentyone from "../../plentyone.app.mjs";

export default {
  key: "plentyone-create-order",
  name: "Create Order",
  description: "Creates a new order in PlentyONE. [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Order/post_rest_orders)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    plentyone,
    orderTypeId: {
      type: "integer",
      label: "Order Type ID",
      description: "The ID of the order type.",
      options: ORDER_TYPE_OPTIONS,
    },
    plentyId: {
      type: "integer",
      label: "Plenty ID",
      description: "The plenty ID of the client that the order belongs to.",
    },
    statusId: {
      propDefinition: [
        plentyone,
        "statusId",
      ],
      optional: true,
    },
    ownerId: {
      type: "integer",
      label: "Owner ID",
      description: "The user ID of the order's owner.",
      optional: true,
    },
    lockStatus: {
      type: "string",
      label: "Lock Status",
      description: "The lock status of the order.",
      options: LOCK_STATUS_OPTIONS,
      optional: true,
    },
    orderItems: {
      type: "string[]",
      label: "Order Items",
      description: "A list of objects of the order items. [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Order/post_rest_orders) for more details.",
      optional: true,
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description: "A list of objects of the order properties. [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Order/post_rest_orders) for more details.",
      optional: true,
    },
    addressRelations: {
      type: "string[]",
      label: "Address Relations",
      description: "A list of objects of the order address relations. [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Order/post_rest_orders) for more details.",
      optional: true,
    },
    relations: {
      type: "string[]",
      label: "Relations",
      description: "A list of objects of the order relations. [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Order/post_rest_orders) for more details.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.plentyone.createOrder({
        $,
        data: {
          typeId: this.orderTypeId,
          plentyId: this.plentyId,
          statusId: this.statusId,
          ownerId: this.ownerId,
          lockStatus: this.lockStatus,
          orderItems: parseObject(this.orderItems),
          properties: parseObject(this.properties),
          addressRelations: parseObject(this.addressRelations),
          relations: parseObject(this.relations),
        },
      });

      $.export("$summary", `Successfully created order: ${response.id}`);
      return response;
    } catch (error) {
      $.export("$summary", "Failed to create order");
      throw new ConfigurationError(error);
    }
  },
};
