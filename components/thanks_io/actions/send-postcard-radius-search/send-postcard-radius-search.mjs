import common from "../common/send-radius.mjs";

export default {
  ...common,
  key: "thanks_io-send-postcard-radius-search",
  name: "Send Postcard via Radius Search",
  description: "Sends a postcard to recipients within a radius. [See the docs here](https://api-docs.thanks.io/#a090f734-a32c-44c3-98f3-cbfbb2284142)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    size: {
      propDefinition: [
        common.props.thanksIo,
        "postcardSize",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.thanksIo.sendPostcard({
      $,
      data: {
        front_image_url: this.frontImageUrl,
        handwriting_style: this.handwritingStyle,
        message: this.message,
        radius_center: {
          address: this.radiusCenter,
        },
        radius_distance_miles: this.radiusDistance,
        size: this.size,
      },
    });
    if (resp?.errors) {
      throw new Error(resp.errors);
    }
    $.export("$summary", "Successfully created postcard order");
    return resp;
  },
};
