import { axios } from "@pipedream/platform";
import linkedin from "../../linkedin.app.mjs";

export default {
  key: "dux-soup-connect-profile",
  name: "Connect Profile",
  description: "Queues a connection request to actively connect with a targeted LinkedIn profile",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    linkedin,
    targetProfileId: {
      type: "string",
      label: "Target Profile ID",
      description: "The ID of the LinkedIn profile you want to target",
    },
  },
  async run({ $ }) {
    const response = await this.linkedin.queueConnectionRequest(this.targetProfileId);
    $.export("$summary", `Successfully queued connection request to profile ID: ${this.targetProfileId}`);
    return response;
  },
};
