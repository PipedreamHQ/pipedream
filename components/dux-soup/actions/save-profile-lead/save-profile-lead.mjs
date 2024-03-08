import linkedin from "../../linkedin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dux-soup-save-profile-lead",
  name: "Save Profile as Lead",
  description: "Queues a profile save action to store the targeted profile as a lead.",
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
  },
  async run({ $ }) {
    const response = await this.linkedin.queueProfileSave(this.targetProfileId);
    $.export("$summary", `Successfully saved profile ${this.targetProfileId} as a lead`);
    return response;
  },
};
