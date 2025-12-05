import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-content",
  name: "List Content",
  description: "List all learning content. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#learning/v1/get-/content)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
  },
  async run({ $ }) {
    const response = await this.workday.listContent({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} content items`);
    return response;
  },
};
