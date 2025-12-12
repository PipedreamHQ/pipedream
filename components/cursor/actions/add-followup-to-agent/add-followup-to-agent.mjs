import cursor from "../../cursor.app.mjs";
import { formatImages } from "../../common/utils.mjs";

export default {
  key: "cursor-add-followup-to-agent",
  name: "Add Followup to Agent",
  description: "Add a followup to an agent. [See the documentation](https://cursor.com/docs/cloud-agent/api/endpoints#add-follow-up)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cursor,
    agentId: {
      propDefinition: [
        cursor,
        "agentId",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt to add to the agent",
    },
    images: {
      propDefinition: [
        cursor,
        "images",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.cursor.addFollowup({
      $,
      agentId: this.agentId,
      data: {
        prompt: {
          text: this.prompt,
          images: await formatImages(this.images),
        },
      },
    });
    $.export("$summary", `Successfully added followup to agent ${this.agentId}`);
    return response;
  },
};
