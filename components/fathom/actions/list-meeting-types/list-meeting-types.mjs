// x-pd-ai: optimized
import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-list-meeting-types",
  name: "List Meeting Types",
  description: "List the meeting types configured for the account (e.g. `Quarterly Business Review`), including whether each is currently `active` or `inactive`. Use this to discover valid meeting type names before filtering meetings by type. [See the documentation](https://developers.fathom.ai/api-reference/meetings/list-meeting-types)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fathom,
    cursor: {
      propDefinition: [
        fathom,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fathom.listMeetingTypes({
      $,
      params: {
        cursor: this.cursor,
      },
    });
    $.export("$summary", `Found ${response?.items?.length} meeting types`);
    return response;
  },
};
