import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-list-projects",
  name: "List Projects",
  description: "List all projects in MeisterTask. [See the docs](https://developers.meistertask.com/reference/get-projects)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    meistertask,
  },
  async run({ $ }) {
    const response = await this.meistertask.listProjects({
      $,
    });

    const data = response?.data ?? [];

    $.export(
      "$summary",
      `Successfully retrieved ${data.length} projects`,
    );

    return data;
  },
};
