import common from "../common/send-radius.mjs";

export default {
  ...common,
  key: "thanks_io-send-notecard-radius-search",
  name: "Send Notecard via Radius Search",
  description: "Sends a notecard to a recipients within a radius. [See the docs here](https://api-docs.thanks.io/#9130103a-1834-4550-88fb-ec5c1e21a59b)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const resp = await this.thanksIo.sendNotecard({
      $,
      data: {
        front_image_url: this.frontImageUrl,
        handwriting_style: this.handwritingStyle,
        message: this.message,
        radius_center: {
          address: this.radiusCenter,
        },
        radius_distance_miles: this.radiusDistance,
      },
    });
    if (resp?.errors) {
      throw new Error(resp.errors);
    }
    $.export("$summary", "Successfully created notecard order");
    return resp;
  },
};
