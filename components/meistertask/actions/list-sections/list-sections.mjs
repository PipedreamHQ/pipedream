import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-list-sections",
  name: "List Sections",
  description: "List sections in MeisterTask, optionally scoped to a specific project. [See the docs](https://developers.meistertask.com/reference/get-sections)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    meistertask,
    projectId: {
      propDefinition: [
        meistertask,
        "projectId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await (this.projectId
      ? this.meistertask.listProjectSections({
        projectId: this.projectId,
        $,
      })
      : this.meistertask.listSections({
        $,
      }));

    const data = response ?? [];

    $.export(
      "$summary",
      `Successfully retrieved ${data.length} sections`,
    );

    return data;
  },
};
