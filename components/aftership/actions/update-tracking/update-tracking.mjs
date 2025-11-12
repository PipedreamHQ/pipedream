import aftership from "../../aftership.app.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "aftership-update-tracking",
  name: "Update Tracking",
  description: "Updates an existing tracking. [See the documentation](https://www.aftership.com/docs/api/4/trackings/put-trackings-slug-tracking_number)",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aftership,
    ...common.props,
    trackingId: {
      propDefinition: [
        aftership,
        "trackingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.aftership.updateTracking({
      $,
      trackingId: this.trackingId,
      data: {
        tracking: this.getData(),
      },
    });
    $.export("$summary", `Successfully updated tracking with ID ${this.trackingId}`);
    return response;
  },
};
