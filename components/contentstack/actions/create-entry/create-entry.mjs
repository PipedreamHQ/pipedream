import contentstack from "../../contentstack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "contentstack-create-entry",
  name: "Create Entry",
  description: "Creates a new entry in Contentstack. [See the documentation]().",
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
    contentTypeUid: {
      propDefinition: [
        contentstack,
        "contentTypeUid",
      ],
    },
    entryTitle: {
      propDefinition: [
        contentstack,
        "entryTitle",
      ],
    },
    content: {
      propDefinition: [
        contentstack,
        "content",
      ],
    },
    metadata: {
      propDefinition: [
        contentstack,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentstack.createEntry();
    $.export("$summary", `Created entry "${response.title}" with UID ${response.uid}`);
    return response;
  },
};
