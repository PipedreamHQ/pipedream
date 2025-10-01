import knowfirst from "../../knowfirst.app.mjs";

export default {
  key: "knowfirst-stop-tracking-business",
  name: "Stop Tracking Business",
  description: "Stop tracking a business that you are currently tracking. [See the documentation](https://www.knowfirst.ai/docs/api/#/Tracking/TrackingDelete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
        () => ({
          tracked: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.knowfirst.stopTrackingBusiness({
      $,
      businessId: this.businessId,
    });

    $.export("$summary", `Successfully stopped tracking business with ID ${this.businessId}`);

    return response;
  },
};
