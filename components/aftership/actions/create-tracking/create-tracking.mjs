import aftership from "../../aftership.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "aftership-create-tracking",
  name: "Create Tracking",
  description: "Creates a tracking. [See the documentation](https://www.aftership.com/docs/api/4/trackings/post-trackings)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aftership,
    trackingNumber: {
      propDefinition: [
        aftership,
        "trackingNumber",
      ],
    },
    ...common.props,
    shipmentTags: {
      propDefinition: [
        aftership,
        "shipmentTags",
      ],
    },
  },
  async run({ $ }) {
    if (this.trackingNumber.length < 4 || this.trackingNumber.length > 100) {
      throw new ConfigurationError("We only accept tracking numbers with length from 4 to 100");
    }
    const response = await this.aftership.createTracking({
      $,
      data: {
        tracking: this.getData(),
      },
    });

    $.export("$summary", `Successfully created tracking with ID ${response.data.tracking.id}`);
    return response;
  },
};
