import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-list-runs",
  name: "List V4 Runs",
  description:
    "List Browser Use V4 runs with keyset pagination. [See the API reference](https://api.browser-use.com/api/v4/openapi.json)",
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
      description: "Cursor returned by the previous page.",
      optional: true,
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Return only runs from this session.",
      optional: true,
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
