import linkedin from "../../linkedin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dux-soup-message-profile",
  name: "Message Profile",
  description: "Queues a direct message that will be sent to the targeted profile",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    linkedin,
    targetProfileId: {
      propDefinition: [
        linkedin,
        "targetProfileId",
      ],
    },
    message: {
      propDefinition: [
        linkedin,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linkedin.queueDirectMessage(this.targetProfileId, this.message);
    $.export("$summary", `Message queued to profile ${this.targetProfileId}`);
    return response;
  },
};
