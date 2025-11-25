import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-message-template-folders",
  name: "List Message Template Folders",
  description: "List the message template folders. [See the documentation](https://dev.frontapp.com/reference/list-folders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frontapp,
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field used to sort the message template folders. Either `created_at` or `updated_at`.",
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Order by which results should be sorted",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};

    if (this.sortBy) {
      params.sort_by = this.sortBy;
    }
    if (this.sortOrder) {
      params.sort_order = this.sortOrder;
    }

    const response = await this.frontapp.listMessageTemplateFolders({
      $,
      params,
    });

    $.export("$summary", `Successfully retrieved ${response._results.length} message template folders`);

    return response._results;
  },
};
