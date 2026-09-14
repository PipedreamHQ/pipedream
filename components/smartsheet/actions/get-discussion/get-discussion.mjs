import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-get-discussion",
  name: "Get Discussion",
  description:
    "Retrieves a single discussion from a Smartsheet sheet, including its embedded comments array"
    + " (requested via `include=comments`). Use **List Discussions** to find a Discussion ID."
    + " Example: `{sheetId: \"1234567890123456\", discussionId: \"3728427551461252\"}` returns"
    + " `{\"title\": \"Velociraptor containment breach\", \"comments\": [{\"id\": ..., \"text\": \"...\"}]}`."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/discussions/discussion-get).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    smartsheet,
    sheetId: {
      propDefinition: [
        smartsheet,
        "sheetIdOrUrl",
      ],
      description:
        "The sheet that contains the discussion. Accepts a numeric sheet ID (e.g. `1234567890123456`), or a"
        + " Smartsheet sheet URL, which is resolved to the ID for you. Use **List Sheets** to enumerate sheets.",
    },
    discussionId: {
      propDefinition: [
        smartsheet,
        "discussionId",
      ],
      description:
        "The ID of the discussion to retrieve (e.g. `3728427551461252`). Run the **List Discussions** action first"
        + " to obtain a valid discussion ID.",
    },
  },
  async run({ $ }) {
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.getDiscussion(sheetId, this.discussionId, {
      $,
      params: {
        include: "comments",
      },
    });

    $.export("$summary", `Retrieved discussion ${this.discussionId} from sheet ${sheetId}`);
    return response;
  },
};
