import app from "../../customer_io.app.mjs";
import options from "../../common/options.mjs";

export default {
  key: "customer_io-add-customers-to-segment",
  name: "Add Customers to Segment",
  description: "Add people to a manual segment by ID. You are limited to 1000 customer IDs per request. [See the docs here](https://www.customer.io/docs/api/#operation/add_to_segment)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerIds: {
      propDefinition: [
        app,
        "customerId",
      ],
      type: "string[]",
      description: "The customer IDs you want to add to the segment.",
    },
    segmentId: {
      type: "string",
      label: "Segment ID",
      description: "The identifier for a segment. You can find your segment's ID on its page in the dashboard—go to Segments, select your segment, and find the ID under Usage.",
    },
    idType: {
      label: "Id Type",
      type: "string",
      description: "The type of ids you want to use. All of the values in the `ids` array must be of this type. If you don't provide this parameter, we assume that the `ids` array contains `id` values.",
      options: options.ID_TYPES,
      optional: true,
    },
  },
  async run({ $ }) {
    await this.app.addCustomersToSegment(
      this.segmentId,
      this.customerIds,
      this.idType,
      $,
    );
    $.export("$summary", "Successfully added customers to segment");
  },
};
