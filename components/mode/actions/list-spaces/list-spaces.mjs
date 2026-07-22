import app from "../../mode.app.mjs";
import {
  LIMIT_MAX,
  LIMIT_MIN,
} from "../../common/constants.mjs";

export default {
  key: "mode-list-spaces",
  name: "List Spaces",
  description: "List the spaces (called Collections in the Mode UI) visible to the authenticated user. This is the canonical lookup tool to resolve a `space_token` before passing it to other actions such as **List Reports**. [See the documentation](https://mode.com/developer/api-reference/management/collections/#listCollections)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    filter: {
      type: "string",
      label: "Filter",
      description: "Optional space filter. Example: `all` to include personal and all accessible spaces.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of spaces to return per page (maps to \`per_page\`). Must be between ${LIMIT_MIN} and ${LIMIT_MAX}.`,
      min: LIMIT_MIN,
      max: LIMIT_MAX,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page of results to return. Providing `page` (or `limit`) paginates the response and includes a `pagination` section with details like the current page and total pages.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listSpaces({
      $,
      params: {
        filter: this.filter,
        per_page: this.limit,
        page: this.page,
      },
    });
    const spaces = response?._embedded?.spaces ?? response;
    const count = Array.isArray(spaces)
      ? spaces.length
      : 0;
    $.export("$summary", `Successfully retrieved ${count} space(s)`);
    return response;
  },
};
