import frame from "../../frame.app.mjs";

export default {
  key: "frame-create-comment",
  name: "Create Comment",
  description: "Creates a new comment on an asset in Frame.io. [See the documentation](https://developer.frame.io/api/reference/operation/createComment/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    frame,
    accountId: {
      propDefinition: [
        frame,
        "accountId",
      ],
    },
    assetId: {
      propDefinition: [
        frame,
        "assetId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The body of the comment.",
    },
    annotation: {
      type: "string",
      label: "Annotation",
      description: "Serialized list of geometry and/or drawing data. [Learn more here](https://developer.frame.io/docs/workflows-assets/working-with-annotations)",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for a comment (documents only).",
      optional: true,
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "Timestamp for the comment, in frames, starting at 0.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Used to produce range-based comments, this is the duration measured in frames.",
      optional: true,
    },
    private: {
      type: "boolean",
      label: "Private",
      description: "Set to true to make your comment a \"Team-only Comment\" that won't be visible to anonymous reviewers or Collaborators.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      frame, assetId, text, annotation, page, timestamp, duration,
    } = this;
    const response = await frame.sendComment({
      $,
      assetId,
      data: {
        text,
        annotation,
        page,
        timestamp,
        duration,
        private: this.private,
      },
    });
    $.export("$summary", `Successfully created comment (ID: ${response.id})`);
    return response;
  },
};
