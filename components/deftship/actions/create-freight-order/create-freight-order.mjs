import deftship from "../../deftship.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "deftship-create-freight-order",
  name: "Create Freight Order",
  description: "Triggers when a new freight order is created in Deftship",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deftship,
  },
  async run({ $ }) {
    const response = await this.deftship.triggerNewFreightOrder();
    this.deftship.emitNewFreightOrder(response.freightOrderId, response);
    $.export("$summary", `New freight order: ${response.freightOrderId}`);
    return response;
  },
};
