import common from "../common/send-recipients.mjs";

export default {
  ...common,
  key: "thanks_io-send-postcard",
  name: "Send Postcard",
  description: "Sends a postcard to a recipient. [See the docs here](https://api-docs.thanks.io/#a090f734-a32c-44c3-98f3-cbfbb2284142)",
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
    const recipients = await this.getRecipients(this.recipients, $);
    const resp = await this.thanksIo.sendPostcard({
      $,
      data: {
        front_image_url: this.frontImageUrl,
        handwriting_style: this.handwritingStyle,
        message: this.message,
        recipients,
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
