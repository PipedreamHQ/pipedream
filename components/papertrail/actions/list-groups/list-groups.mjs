import papertrail from "../../papertrail.app.mjs";

export default {
  key: "papertrail-list-groups",
  name: "List Groups",
  description:
    "List all groups and the systems they contain. [See the documentation](https://www.papertrail.com/help/settings-api/#list-groups)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    papertrail,
  },
  async run({ $ }) {
    const groups = await this.papertrail.listGroups({
      $,
    });
    const count = Array.isArray(groups)
      ? groups.length
      : 0;
    $.export(
      "$summary",
      `Retrieved ${count} group${count === 1
        ? ""
        : "s"}`,
    );
    return groups;
  },
};
