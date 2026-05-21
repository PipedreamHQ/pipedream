import amplenote from "../../app/amplenote.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Notes",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "amplenote-list-notes",
  description: "List all notes. [See the documentation](https://www.amplenote.com/api_documentation#get-/notes)",
  type: "action",
  props: {
    amplenote,
    since: {
      type: "string",
      label: "Since",
      description: "Return notes created since the given date and time (in Unix timestamp format). Example: `1722985961`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.amplenote.getNotes({
      $,
      params: {
        since: this.since,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} note${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
});
