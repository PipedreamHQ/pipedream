import knowfirst from "../../knowfirst.app.mjs";

export default {
  key: "knowfirst-start-tracking-business",
  name: "Start Tracking Business",
  description: "Start tracking a business to receive notifications when changes occur. [See the documentation](https://www.knowfirst.ai/docs/api/#/Tracking/TrackingPut)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    knowfirst,
    businessId: {
      propDefinition: [
        knowfirst,
        "businessId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.knowfirst.startTrackingBusiness({
      $,
      businessId: this.businessId,
    });

    $.export("$summary", `Successfully started tracking business with ID ${this.businessId}`);

    return response;
  },
};
