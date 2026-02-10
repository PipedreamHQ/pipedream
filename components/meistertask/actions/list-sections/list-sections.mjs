import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-list-sections",
  name: "List Sections",
  description: "List all sections in MeisterTask. [See the docs](https://developers.meistertask.com/reference/get-sections)",
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

    const data = response?.data ?? [];

    $.export(
      "$summary",
      `Successfully retrieved ${data.length} sections`,
    );

    return data;
  },
};
