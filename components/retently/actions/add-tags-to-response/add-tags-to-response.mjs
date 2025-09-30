import retently from "../../retently.app.mjs";

export default {
  key: "retently-add-tags-to-response",
  name: "Add Tags to Response",
  description: "Adds tags to a response. [See the documentation](https://www.retently.com/api/#api-add-response-tags-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    retently,
    responseId: {
      propDefinition: [
        retently,
        "responseId",
      ],
    },
    tags: {
      propDefinition: [
        retently,
        "tags",
      ],
      description: "Tags to add to the feedback response",
    },
    op: {
      type: "boolean",
      label: "Override?",
      description: "Set to `true` to override existing tags, or set to `false` to append the tags to the response. Defaults to `false`.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      id: this.responseId,
      tags: this.tags,
    };

    if (!this.op) {
      data.op = "append";
    }

    const response = await this.retently.addFeedbackTags({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully added tags to response with ID ${this.responseId}.`);
    }

    return response;
  },
};
