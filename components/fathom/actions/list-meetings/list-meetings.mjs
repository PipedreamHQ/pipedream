import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-list-meetings",
  name: "List Meetings",
  description: "List meetings. [See the documentation](https://developers.fathom.ai/api-reference/meetings/list-meetings)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fathom,
    includeActionItems: {
      propDefinition: [
        fathom,
        "includeActionItems",
      ],
    },
    includeCrmMatches: {
      propDefinition: [
        fathom,
        "includeCrmMatches",
      ],
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Filter to meetings with created_at after this timestamp, e.g. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Filter to meetings with created_at before this timestamp, e.g. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "If continuing a previous request, the cursor to start from",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fathom.listMeetings({
      $,
      params: {
        include_action_items: this.includeActionItems,
        include_crm_matches: this.includeCrmMatches,
        created_after: this.createdAfter,
        created_before: this.createdBefore,
        cursor: this.cursor,
      },
    });
    $.export("$summary", `Successfully listed ${response?.items?.length} meetings`);
    return response;
  },
};
