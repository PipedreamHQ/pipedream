import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-list-browser-sessions",
  name: "List Browser Sessions",
  description: "List standalone Browser Use browser sessions for direct browser control via CDP. [See the documentation](https://docs.browser-use.com/cloud/api-v3/browsers/list-browser-sessions)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
    pageSize: {
      propDefinition: [
        browserUse,
        "pageSize",
      ],
    },
    pageNumber: {
      propDefinition: [
        browserUse,
        "pageNumber",
      ],
    },
    filterBy: {
      propDefinition: [
        browserUse,
        "browserSessionStatus",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.listBrowserSessions({
      $,
      params: cleanObject({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        filterBy: this.filterBy,
      }),
    });

    $.export("$summary", `Retrieved ${response.items?.length ?? 0} browser sessions`);
    return response;
  },
};
