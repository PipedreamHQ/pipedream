import klaviyo from "../../klaviyo.app.mjs";

export default {
  key: "klaviyo-get-lists",
  name: "Get Lists",
  description: "Get a listing of all of the lists in an account. [See the documentation](https://developers.klaviyo.com/en/reference/get_lists)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    klaviyo,
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort by",
      options: [
        "created",
        "id",
        "name",
        "updated",
      ],
      default: "created",
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Whether to sort ascending or descending. Default: `descending`",
      options: [
        "asc",
        "desc",
      ],
      default: "desc",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const lists = this.klaviyo.paginate({
      fn: this.klaviyo.getLists,
      opts: {
        sort: `${this.sortDirection === "desc"
          ? "-"
          : ""}${this.sort}`,
      },
      max: this.maxResults,
    });

    const results = [];
    for await (const list of lists) {
      results.push(list);
    }

    $.export("$summary", `Successfully fetched ${results.length} list${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
