import common from "../common/send-radius.mjs";

export default {
  ...common,
  key: "thanks_io-send-letter-radius-search",
  name: "Send Letter via Radius Search",
  description: "Sends a letter to recipients within a radius. [See the docs here](https://api-docs.thanks.io/#45925795-d3c8-4532-ad6e-07aa9f4d19f8)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    returnName: {
      propDefinition: [
        common.props.thanksIo,
        "returnName",
      ],
    },
    returnAddress: {
      propDefinition: [
        common.props.thanksIo,
        "returnAddress",
      ],
    },
    returnAddress2: {
      propDefinition: [
        common.props.thanksIo,
        "returnAddress2",
      ],
    },
    returnCity: {
      propDefinition: [
        common.props.thanksIo,
        "returnCity",
      ],
    },
    returnState: {
      propDefinition: [
        common.props.thanksIo,
        "returnState",
      ],
    },
    returnPostalCode: {
      propDefinition: [
        common.props.thanksIo,
        "returnPostalCode",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.thanksIo.sendLetter({
      $,
      data: {
        front_image_url: this.frontImageUrl,
        handwriting_style: this.handwritingStyle,
        message: this.message,
        radius_center: {
          address: this.radiusCenter,
        },
        radius_distance_miles: this.radiusDistance,
        return_name: this.returnName,
        return_address: this.returnAddress,
        return_address2: this.returnAddress2,
        return_city: this.returnCity,
        return_state: this.returnState,
        return_postal_code: this.returnPostalCode,
      },
    });
    if (resp?.errors) {
      throw new Error(resp.errors);
    }
    $.export("$summary", "Successfully created letter order");
    return resp;
  },
};
