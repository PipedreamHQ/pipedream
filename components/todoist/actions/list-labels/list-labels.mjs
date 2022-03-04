import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-labels",
  name: "List Labels",
  description: "Returns a list of all labels. [See the docs here](https://developer.todoist.com/rest/v1/#get-all-labels)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
  },
  async run ({ $ }) {
    const resp = await this.todoist.getLabels({
      $,
    });
    $.export("$summary", `Successfully retrieved ${resp.length} label${resp.length === 1
      ? ""
      : "s"}`);
    return resp;
  },
};
