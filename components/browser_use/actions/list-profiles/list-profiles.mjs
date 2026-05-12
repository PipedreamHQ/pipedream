import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-list-profiles",
  name: "List Profiles",
  description: "List Browser Use profiles, optionally searching by profile name or user ID. [See the documentation](https://docs.browser-use.com/cloud/api-v3/profiles/list-profiles)",
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
    query: {
      type: "string",
      label: "Query",
      description: "Optional search query for profile name or user ID. Maximum length: `200` characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.listProfiles({
      $,
      params: cleanObject({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        query: this.query,
      }),
    });

    $.export("$summary", `Retrieved ${response.items?.length ?? 0} profiles`);
    return response;
  },
};
