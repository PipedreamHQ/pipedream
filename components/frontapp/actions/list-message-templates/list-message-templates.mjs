import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-message-templates",
  name: "List Message Templates",
  description: "List the message templates. [See the documentation](https://dev.frontapp.com/reference/list-message-templates).",
  version: "0.0.1",
  type: "action",
  props: {
    frontApp,
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field used to sort the message templates",
      options: [
        "created_at",
        "updated_at",
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
  },
  async run({ $ }) {
    const {
      frontApp,
      sortBy,
      sortOrder,
    } = this;

    const response = await frontApp.listMessageTemplates({
      $,
      params: {
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    });

    const templates = response._results || [];
    const length = templates.length;
    $.export("$summary", `Successfully retrieved ${length} message template${length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
