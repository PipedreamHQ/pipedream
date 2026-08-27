import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-list-runs",
  name: "List V4 Runs",
  description:
    "List Browser Use V4 runs, optionally filter by V4 session, and continue with the cursor from the previous response. Use returned Run IDs with Get V4 Run or Cancel V4 Run. [See the documentation](https://api.browser-use.com/api/v4/openapi.json)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of runs to return.",
      optional: true,
      default: 50,
      min: 1,
      max: 100,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "The `nextCursor` string returned by the previous List V4 Runs response.",
      optional: true,
    },
    sessionId: {
      propDefinition: [
        browserUse,
        "v4SessionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.listRuns({
      $,
      params: cleanObject({
        limit: this.limit,
        cursor: this.cursor,
        sessionId: this.sessionId,
      }),
    });

    $.export("$summary", `Retrieved ${response.runs?.length ?? 0} V4 runs`);
    return response;
  },
};
