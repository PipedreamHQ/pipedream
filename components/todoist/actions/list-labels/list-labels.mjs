import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-labels",
  name: "List Labels",
  description: "Returns a list of all labels. [See the documentation](https://developer.todoist.com/api/v1#tag/Labels/operation/get_labels_api_v1_labels_get)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    todoist,
  },
  async run ({ $ }) {
    const resp = await this.todoist.getLabels({
      $,
    });
    $.export("$summary", `Successfully retrieved ${resp?.results?.length} label${resp?.results?.length === 1
      ? ""
      : "s"}`);
    return resp?.results;
  },
};
