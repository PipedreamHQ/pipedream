import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-list-sessions",
  name: "List Sessions",
  description: "List Browser Use agent sessions for the authenticated project. [See the documentation](https://docs.browser-use.com/cloud/api-v3/sessions/list-sessions)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "Page number to fetch. The first page is `1`.",
      optional: true,
      default: 1,
      min: 1,
    },
    pageSize: {
      propDefinition: [
        browserUse,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.listSessions({
      $,
      params: cleanObject({
        page: this.pageNumber,
        page_size: this.pageSize,
      }),
    });

    $.export("$summary", `Retrieved ${response.sessions?.length ?? 0} sessions`);
    return response;
  },
};
