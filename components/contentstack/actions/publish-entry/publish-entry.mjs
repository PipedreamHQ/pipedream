import contentstack from "../../contentstack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "contentstack-publish-entry",
  name: "Publish Entry",
  description: "Publishes a specific entry using its UID. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    contentstack,
    stackId: {
      propDefinition: [
        contentstack,
        "stackId",
      ],
    },
    entryUid: {
      propDefinition: [
        contentstack,
        "entryUid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.contentstack.publishEntry();
    $.export("$summary", `Successfully published entry with UID ${this.entryUid}`);
    return response;
  },
};
