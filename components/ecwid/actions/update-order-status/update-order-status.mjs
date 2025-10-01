import { FULFILMENT_STATUS_LIST } from "../../commons/commons.mjs";
import ecwid from "../../ecwid.app.mjs";
export default {
  name: "Ecwid Update Order Status",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "ecwid-update-order-status",
  description: "Update the Status of an Ecwid Order. Makes use of the [Update Order API](https://api-docs.ecwid.com/reference/update-order).",
  props: {
    ecwid,
    condition: {
      label: "Condition to execute Update",
      description: "Apply status change conditionally based on input",
      type: "boolean",
      default: true,
      optional: true,
    },
    orderId: {
      label: "Order ID",
      description: "Order ID for which fulfilment status need to be updated",
      type: "string",
      optional: false,
    },
    fulfilmentStatus: {
      label: "Fulfilment Status",
      description: "New Fulfilment Status to be updated in the order",
      type: "string",
      options: FULFILMENT_STATUS_LIST,
      optional: false,
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let update = "IGNORED";
    if (this.condition) {
      const updateStatus = await
      this.ecwid.updateFulfilmentStatus(this.orderId, this.fulfilmentStatus);
      if (updateStatus.updateCount === 1) {
        console.log("Updated Order Status of " + this.orderId + " to " + this.fulfilmentStatus);
        $.export("$summary", "Updated Order Status of " + this.orderId + " to " + this.fulfilmentStatus);
        update = "UPDATED";
      }
      else {
        console.error("Error Updating Order Status of " + this.orderId + " to " + this.fulfilmentStatus);
        update = "ERROR";
        $.export("$summary", "Error Updating Order Status of " + this.orderId + " to " + this.fulfilmentStatus);
        if ($.flow) {
          return $.flow.exit("Error Updating Order Status of " + this.orderId + " to " + this.fulfilmentStatus);
        } else {
          throw new Error("Error Updating Order Status of " + this.orderId + " to " + this.fulfilmentStatus);
        }
      }
    } else {
      $.export("$summary", "No updates done to order " + this.orderId);
    }
    $.export("$summary", "Order Update Successful " + this.orderId);
    return {
      "UpdateStatus": update,
    };
  },
};
