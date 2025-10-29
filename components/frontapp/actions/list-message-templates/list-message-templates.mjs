import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-message-templates",
  name: "List Message Templates",
  description: "List the message templates. [See the documentation](https://dev.frontapp.com/reference/list-message-templates).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frontApp,
    sortBy: {
      type: "string",
      label: "Sort By Field",
      description: "Field used to sort the message templates",
      options: [
        {
          label: "Created At",
          value: "created_at",
        },
        {
          label: "Updated At",
          value: "updated_at",
        },
      ],
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Order by which results should be sorted",
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        frontApp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const items = this.frontApp.paginate({
      fn: this.frontApp.listMessageTemplates,
      params: {
        sort_by: this.sortBy,
        sort_order: this.sortOrder,
      },
      maxResults: this.maxResults,
      $,
    });

    const results = [];
    for await (const item of items) {
      results.push(item);
    }
    $.export("$summary", `Successfully retrieved ${results?.length} message template${results?.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
