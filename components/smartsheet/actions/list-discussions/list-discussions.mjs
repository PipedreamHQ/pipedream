import smartsheet from "../../smartsheet.app.mjs";
import {
  DEFAULT_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DISCUSSION_INCLUDE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "smartsheet-list-discussions",
  name: "List Discussions",
  description:
    "Lists discussions on a Smartsheet sheet (GET /sheets/{sheetId}/discussions). If a Row ID is supplied, lists"
    + " discussions scoped to that row instead (GET /sheets/{sheetId}/rows/{rowId}/discussions), since the sheet-level"
    + " endpoint does not accept a row filter. Supports pagination and optional inclusion of comments/attachments."
    + " The response includes `pageNumber` and `totalPages` — to fetch more, call again with `page` incremented by 1"
    + " while `pageNumber` is less than `totalPages`. Requesting a page beyond `totalPages` returns the last page"
    + " again rather than an empty result, so do not use a shorter or empty page as a stop signal."
    + " Pass `fields` (comma-separated, e.g. `id,title,commentCount`) to get back only those top-level fields per"
    + " discussion instead of the full object — useful when you just need titles/counts, not full comment threads."
    + " Use **List Sheets** to find a Sheet ID."
    + " Example: `{sheetId: \"1234567890123456\", include: [\"comments\"]}` returns discussions with their full"
    + " comment threads embedded."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/discussions/discussions-list).",
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
        "The sheet whose discussions to list. Accepts a numeric sheet ID (e.g. `1234567890123456`), or a Smartsheet"
        + " sheet URL, which is resolved to the ID for you. Use **List Sheets** to enumerate sheets.",
    },
    rowId: {
      propDefinition: [
        smartsheet,
        "rowId",
      ],
      description:
        "Optional. If provided, lists discussions for this specific row instead of the whole sheet. Use **Get"
        + " Sheet** or **Search** to find row IDs.",
      optional: true,
    },
    include: {
      type: "string[]",
      label: "Include",
      description:
        "Optional. Sub-objects to include. `attachments` is ignored unless `comments` is also included, since"
        + " attachments are nested under comments.",
      options: DISCUSSION_INCLUDE_OPTIONS,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description:
        `Optional. The number of discussions to return per page (min ${MIN_PAGE_SIZE}, max ${MAX_PAGE_SIZE};`
        + ` Smartsheet default ${DEFAULT_PAGE_SIZE}).`,
      optional: true,
      min: MIN_PAGE_SIZE,
      max: MAX_PAGE_SIZE,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Optional. The 1-based page number of results to return (default 1).",
      optional: true,
      min: 1,
    },
    fields: {
      type: "string",
      label: "Fields",
      description:
        "Optional. Comma-separated list of top-level discussion fields to return (e.g. `id,title,commentCount`),"
        + " instead of the full discussion object. If omitted, the full object (including embedded comments, if"
        + " requested via Include) is returned unchanged.",
      optional: true,
    },
  },
  async run({ $ }) {
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });

    const params = {
      include: this.include?.length
        ? this.include.join(",")
        : undefined,
      pageSize: this.pageSize,
      page: this.page,
    };

    const response = this.rowId
      ? await this.smartsheet.listRowDiscussions(sheetId, this.rowId, {
        $,
        params,
      })
      : await this.smartsheet.listDiscussions(sheetId, {
        $,
        params,
      });

    if (this.fields) {
      const keys = this.fields.split(",").map((f) => f.trim())
        .filter(Boolean);
      response.data = (response.data || []).map((discussion) =>
        Object.fromEntries(keys.filter((key) => key in discussion).map((key) => [
          key,
          discussion[key],
        ])));
    }

    const discussions = response.data || [];
    $.export("$summary", `Retrieved ${discussions.length} discussion(s) from sheet ${sheetId}`);
    return response;
  },
};
