import frameio from "../../frameio.app.mjs";

export default {
  key: "frameio-create-comment",
  name: "Create Comment",
  description: "Creates a new comment on an asset in Frame.io. [See the documentation](https://developer.frame.io/api/reference/operation/createcomment/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    frameio,
    assetId: {
      propDefinition: [
        frameio,
        "assetId",
      ],
    },
    message: {
      propDefinition: [
        frameio,
        "message",
      ],
    },
    timestamp: {
      propDefinition: [
        frameio,
        "timestamp",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.frameio.sendComment({
      assetId: this.assetId,
      message: this.message,
      timestamp: this.timestamp,
    });
    $.export("$summary", `Successfully created comment on asset ${this.assetId}`);
    return response;
  },
};
