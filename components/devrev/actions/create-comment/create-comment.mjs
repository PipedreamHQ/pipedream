import devrev from "../../devrev.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "devrev-create-comment",
  name: "Create Comment",
  description: "Creates a new comment on a work item in DevRev. [See the documentation](https://devrev.ai/docs/apis/beta-api-spec#/operations/timeline-entries-create)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    devrev,
    workId: {
      propDefinition: [
        devrev,
        "workId",
      ],
    },
    body: {
      propDefinition: [
        devrev,
        "body",
      ],
      description: "The comment's body",
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility of the entry. If `private`, then the entry is only visible to the creator, `internal` is visible with the Dev organization, `external` is visible to the Dev organzation and Rev users, and `public` is visible to all. If not set, then the default visibility is `external`.",
      optional: true,
      options: Object.values(constants.VISIBILITY),
    },
  },
  async run({ $ }) {
    const data = {
      type: "timeline_comment",
      object: this.workId,
      body: this.body,
      visibility: this.visibility,
    };

    const response = await this.devrev.createComment({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created comment with ID ${response.timeline_entry.id}.`);
    }

    return response;
  },
};
